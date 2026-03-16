/**
 * PDF Question Extractor for SimulaSIM
 * 
 * Extracts questions from Korlantas PDF textbooks:
 * 1. Reads PDF text for question content
 * 2. Scans QR codes for video URLs
 * 3. Outputs JSON ready for Supabase import
 * 
 * Usage: node extract_questions.cjs <pdf_file> <exam_type> <module_number>
 * Example: node extract_questions.cjs public/Sim-C-Modul-2.pdf "SIM C" 2
 */

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');
const { execSync } = require('child_process');

const VIDEO_BASE = 'https://e-avismedia.korlantas.polri.go.id/video360/';

// ====== STEP 1: Extract text from all pages ======
async function extractAllText(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    pages.push({ pageNum: i, text });
  }
  return { pages, numPages: doc.numPages };
}

// ====== STEP 2: Find question page ranges ======
function findSections(pages) {
  const sections = { bahaya: null, wawasan: null, pengetahuan: null, end: null };
  
  for (const p of pages) {
    const t = p.text.toLowerCase().trim();
    // Separator pages are SHORT (< 150 chars) and contain the section name
    // This avoids matching the table of contents which is much longer
    const isShortPage = t.length < 150;
    
    if (isShortPage && t.includes('persepsi bahaya') && t.includes('modul') && !sections.bahaya) {
      sections.bahaya = p.pageNum + 1;
    }
    if (isShortPage && t.includes('wawasan') && t.includes('modul') && !t.includes('persepsi') && !sections.wawasan) {
      sections.wawasan = p.pageNum + 1;
    }
    if (isShortPage && t.includes('pengetahuan') && t.includes('modul') && !sections.pengetahuan) {
      sections.pengetahuan = p.pageNum + 1;
    }
  }
  
  // Find end of questions (bibliography / tim penyusun page)
  for (const p of pages) {
    if (p.text.includes('Daftar Pustaka') || p.text.includes('Tim Penyusun')) {
      sections.end = p.pageNum;
      break;
    }
  }
  
  return sections;
}

// ====== STEP 3: Scan QR codes from specific pages ======
async function scanQRFromPages(pdfPath, startPage, endPage) {
  const tmpDir = '/tmp/simulasim_qr_pages';
  execSync(`mkdir -p ${tmpDir}`);
  execSync(`rm -f ${tmpDir}/*.png`);
  
  console.log(`  Rendering pages ${startPage}-${endPage} at 600dpi...`);
  execSync(`pdftoppm -png -r 600 -f ${startPage} -l ${endPage} "${pdfPath}" ${tmpDir}/page`);
  
  const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.png')).sort();
  const results = {}; // pageNum -> [urls]
  
  for (const file of files) {
    const pageNum = parseInt(file.match(/page-(\d+)/)?.[1] || '0');
    const imgPath = `${tmpDir}/${file}`;
    
    const img = await loadImage(imgPath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const urls = new Set();
    
    // Scan in a fine grid
    const cols = 5, rows = 8;
    const cellW = Math.floor(canvas.width / cols);
    const cellH = Math.floor(canvas.height / rows);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW;
        const y = r * cellH;
        const w = Math.min(Math.floor(cellW * 1.8), canvas.width - x);
        const h = Math.min(Math.floor(cellH * 1.8), canvas.height - y);
        if (w < 50 || h < 50) continue;
        try {
          const regionData = ctx.getImageData(x, y, w, h);
          const code = jsQR(regionData.data, w, h);
          if (code && code.data) urls.add(code.data);
        } catch(e) { /* skip */ }
      }
    }
    
    if (urls.size > 0) {
      results[pageNum] = [...urls];
      console.log(`  Page ${pageNum}: ${urls.size} QR(s) found`);
    }
  }
  
  // Cleanup
  execSync(`rm -rf ${tmpDir}`);
  
  return results;
}

// ====== STEP 4: Convert QR URL to direct MP4 ======
function qrToVideoUrl(qrUrl) {
  // Input:  https://e-avis.korlantas.polri.go.id/qr-video/?CODE
  // Output: https://e-avismedia.korlantas.polri.go.id/video360/CODE.mp4
  const match = qrUrl.match(/\?([A-Za-z0-9_-]+)$/);
  if (match) {
    return `${VIDEO_BASE}${match[1]}.mp4`;
  }
  return qrUrl;
}

// ====== STEP 5: Parse questions from text ======
function parseWawasanPengetahuanQuestions(pages, startPage, endPage, category, qrData) {
  const questions = [];
  
  for (let pn = startPage; pn < endPage; pn++) {
    const page = pages.find(p => p.pageNum === pn);
    if (!page) continue;
    
    let text = page.text;
    // Aggressive cleanup
    text = text.replace(/Buku Panduan Latihan Ujian Teori Sim [A-Z]/gi, '');
    text = text.replace(/Modul \d+ \| (Wawasan|Pengetahuan|Persepsi Bahaya)/gi, '');
    text = text.replace(/Materi Uji Teori Sim/gi, '');
    text = text.replace(/scan QR untuk melihat video/gi, ' |||SPLIT||| ');
    
    const parts = text.split('|||SPLIT|||').map(p => p.trim());
    const pageUrls = [...(qrData[pn] || [])];
    
    // In the PDF text stream, "scan QR..." usually comes BEFORE the question content.
    // So: [Header, Q1_Content, Q2_Content, Q3_Content]
    // The URLs detected on the page should be zipped with parts starting from index 1.
    
    for (let i = 1; i < parts.length; i++) {
      const block = parts[i];
      if (block.length < 15) continue; // Noise or very short
      
      // Clean leading page numbers like "93" (since they often follow the marker)
      let cleanedBlock = block.replace(/^\d{1,3}\s+/, '').trim();
      
      // Try to find the question (ends with ?)
      const qMatch = cleanedBlock.match(/(.*?\?)/); // First question mark
      let questionText = qMatch ? qMatch[1].trim() : cleanedBlock;
      
      // Remove any remaining header noise from questionText
      questionText = questionText.replace(/^Modul \d+\s*\|\s*/i, '');
      
      const videoUrl = pageUrls.length > 0 ? qrToVideoUrl(pageUrls.shift()) : null;
      
      if (questionText.length > 10) {
        questions.push({
          question_text: questionText,
          material_category: category,
          media_url: videoUrl,
          media_type: videoUrl ? 'video' : null,
          options: [
            { id: 'A', text: '', isCorrect: true },
            { id: 'B', text: '', isCorrect: false },
            { id: 'C', text: '', isCorrect: false },
          ]
        });
      }
    }
  }
  
  return questions;
}

// ====== STEP 5.1: Special parser for Persepsi Bahaya (Image based, no QR) ======
function parsePersepsiBahayaQuestions(pages, startPage, endPage, category) {
  const questions = [];
  
  for (let pn = startPage; pn < endPage; pn++) {
    const page = pages.find(p => p.pageNum === pn);
    if (!page) continue;
    
    let text = page.text;
    // Cleanup headers/footers
    text = text.replace(/Buku Panduan Latihan Ujian Teori Sim [A-Z]/gi, '');
    text = text.replace(/Modul \d+ - Persepsi Bahaya/gi, '');
    text = text.replace(/Modul \d+ \| Persepsi Bahaya/gi, '');
    
    // In the PDF text stream for PH, the pattern is:
    // [Scenario text describing situation + Answer] + [Prompt Topic]
    // The scenario starts with "Pengendara sedang mengendarai"
    
    const blocks = text.split(/Pengendara sedang mengendarai/).filter(b => b.trim().length > 30);
    
    for (let rawBlock of blocks) {
      const block = 'Pengendara sedang mengendarai ' + rawBlock.trim();
      
      // The prompt (top/left text in PDF) usually appears AFTER the scenario in the stream.
      // It starts with "Terdapat..." or "Anda..." or is a short sentence at the end.
      const sentences = block.split(/\s\s+|\. /).map(s => s.trim()).filter(s => s.length > 5);
      
      // Usually, the last sentence is the "Prompt" topic.
      let prompt = sentences[sentences.length - 1] || "";
      if (!prompt.match(/^(Terdapat|Anda|Bagaimana)/i)) {
        // Fallback: look for Terdapat/Anda anywhere if last sentence isn't it
        const match = block.match(/(Terdapat [^.]+\.|Anda [^.]+\.)\s*$/);
        if (match) prompt = match[1];
      }
      
      // Correct answer is the part saying "Pengendara (harus|dapat)..."
      const answerMatch = block.match(/(Pengendara (?:harus|dapat) [^.]+\.)/i);
      const correctAnswer = answerMatch ? answerMatch[1].trim() : "Menyesuaikan kecepatan dan kewaspadaan.";
      
      // The scenario is the part before the answer and prompt
      const scenario = block.split(correctAnswer)[0].trim() + ".";
      
      if (prompt.length > 10) {
        questions.push({
          question_text: `${prompt}\n\nsituasi: ${scenario}`,
          material_category: category,
          media_url: null, // No video QR
          media_type: 'image',
          options: [
            { id: 'A', text: correctAnswer, isCorrect: true },
            { id: 'B', text: 'Melaju terus dengan kecepatan tinggi untuk menghindari hambatan', isCorrect: false },
            { id: 'C', text: 'Mengulangi pengereman mendadak tanpa melihat spion', isCorrect: false },
          ]
        });
      }
    }
  }
  
  return questions;
}

// ====== MAIN ======
async function main() {
  const pdfFile = process.argv[2] || 'public/Sim-C-Modul-2.pdf';
  const examType = process.argv[3] || 'SIM C';
  const moduleNumber = parseInt(process.argv[4]) || 2;
  const skipBahaya = process.argv.includes('--skip-bahaya');
  const outputFile = `questions_${examType.replace(' ', '_')}_modul_${moduleNumber}.json`;
  
  console.log(`\n📚 SimulaSIM Question Extractor`);
  console.log(`   PDF: ${pdfFile}`);
  console.log(`   Exam: ${examType} | Module: ${moduleNumber} | Skip Bahaya: ${skipBahaya}\n`);
  
  // Step 1: Extract all text
  console.log('📄 Step 1: Extracting text from PDF...');
  const { pages, numPages } = await extractAllText(pdfFile);
  console.log(`   ${numPages} pages extracted\n`);
  
  // Step 2: Find sections
  console.log('🔍 Step 2: Finding question sections...');
  const sections = findSections(pages);
  console.log(`   Persepsi Bahaya: page ${sections.bahaya}`);
  console.log(`   Wawasan: page ${sections.wawasan}`);
  console.log(`   Pengetahuan: page ${sections.pengetahuan}`);
  console.log(`   End: page ${sections.end}\n`);
  
  // Step 3: Scan QR codes from Wawasan + Pengetahuan pages
  console.log('📷 Step 3: Scanning QR codes from question pages...');
  const qrStart = sections.wawasan || sections.pengetahuan;
  const qrEnd = sections.end ? sections.end - 1 : numPages;
  const qrData = await scanQRFromPages(pdfFile, qrStart, qrEnd);
  const totalQRs = Object.values(qrData).reduce((s, a) => s + a.length, 0);
  console.log(`   Total QR codes found: ${totalQRs}\n`);
  
  // Step 4: Parse questions
  console.log('📝 Step 4: Parsing questions...');
  
  const wawasanQs = parseWawasanPengetahuanQuestions(
    pages, sections.wawasan, sections.pengetahuan, 'Wawasan', qrData
  );
  console.log(`   Wawasan: ${wawasanQs.length} questions`);
  
  const pengetahuanQs = parseWawasanPengetahuanQuestions(
    pages, sections.pengetahuan, sections.end || numPages, 'Pengetahuan', qrData
  );
  console.log(`   Pengetahuan: ${pengetahuanQs.length} questions`);
  
  let bahayaQs = [];
  if (!skipBahaya) {
    bahayaQs = parsePersepsiBahayaQuestions(
      pages, sections.bahaya, sections.wawasan
    );
    console.log(`   Persepsi Bahaya: ${bahayaQs.length} questions`);
  } else {
    console.log(`   Persepsi Bahaya: SKIPPED`);
  }
  
  // Step 5: Combine and save
  const allQuestions = [...bahayaQs, ...wawasanQs, ...pengetahuanQs].map(q => ({
    exam_type: examType,
    module_number: moduleNumber,
    ...q
  }));
  
  console.log(`\n✅ Total: ${allQuestions.length} questions extracted`);
  
  fs.writeFileSync(outputFile, JSON.stringify(allQuestions, null, 2));
  console.log(`💾 Saved to: ${outputFile}`);
  
  // Show stats
  const withVideo = allQuestions.filter(q => q.media_url).length;
  console.log(`\n📊 Stats:`);
  console.log(`   With video URL: ${withVideo}`);
  console.log(`   Without video: ${allQuestions.length - withVideo}`);
  console.log(`   ⚠️  Options A/B/C need to be filled manually via admin dashboard`);
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
