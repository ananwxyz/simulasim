/**
 * Convert question JSON files to Excel
 * Reads all questions_*.json files and creates a single .xlsx file
 */

const fs = require('fs');
const XLSX = require('xlsx');

function main() {
  const jsonFiles = fs.readdirSync('.').filter(f => f.startsWith('questions_') && f.endsWith('.json')).sort();
  
  console.log(`\n📊 Excel Converter`);
  console.log(`   Found ${jsonFiles.length} JSON files\n`);
  
  const allRows = [];
  
  for (const file of jsonFiles) {
    const questions = JSON.parse(fs.readFileSync(file, 'utf-8'));
    console.log(`📁 ${file}: Processing ${questions.length} soal`);
    
    for (const q of questions) {
      // Flatten options for Excel columns
      const optionsStr = q.options.map(o => `${o.id}: ${o.text}`).join(' | ');
      const correctOption = q.options.find(o => o.isCorrect)?.id || '';

      allRows.push({
        'Exam Type': q.exam_type,
        'Module Number': q.module_number,
        'Category': q.material_category,
        'Question Text': q.question_text,
        'Media URL': q.media_url || '',
        'Media Type': q.media_type || '',
        'Options (A|B|C)': optionsStr,
        'Correct Answer': correctOption,
        'Raw Options JSON': JSON.stringify(q.options)
      });
    }
  }
  
  // Create Worksheet
  const worksheet = XLSX.utils.json_to_sheet(allRows);
  
  // Set column widths
  const columnWidths = [
    { wch: 10 }, // Exam Type
    { wch: 15 }, // Module Number
    { wch: 15 }, // Category
    { wch: 60 }, // Question Text
    { wch: 80 }, // Media URL
    { wch: 12 }, // Media Type
    { wch: 100 }, // Options
    { wch: 15 }, // Correct Answer
    { wch: 20 }  // JSON
  ];
  worksheet['!cols'] = columnWidths;

  // Create Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  
  // Write File
  const outputFile = 'simulasim_questions.xlsx';
  XLSX.writeFile(workbook, outputFile);
  
  console.log(`\n✅ DONE! Total ${allRows.length} soal berhasil dikonversi ke ${outputFile}`);
}

main();
