/**
 * Generate SQL INSERT statements from question JSON files
 * Run the output SQL in Supabase SQL Editor
 */

const fs = require('fs');

function escapeSql(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function main() {
  const jsonFiles = fs.readdirSync('.').filter(f => f.startsWith('questions_') && f.endsWith('.json')).sort();
  
  let sql = '-- SimulaSIM Bulk Question Import\n';
  sql += '-- Generated: ' + new Date().toISOString() + '\n\n';
  
  let totalCount = 0;
  
  for (const file of jsonFiles) {
    const questions = JSON.parse(fs.readFileSync(file, 'utf-8'));
    sql += `-- === ${file} (${questions.length} questions) ===\n`;
    
    for (const q of questions) {
      const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
      sql += `INSERT INTO questions (exam_type, module_number, material_category, question_text, media_url, media_type, options) VALUES (`;
      sql += `${escapeSql(q.exam_type)}, `;
      sql += `${q.module_number}, `;
      sql += `${escapeSql(q.material_category)}, `;
      sql += `${escapeSql(q.question_text)}, `;
      sql += `${q.media_url ? escapeSql(q.media_url) : 'NULL'}, `;
      sql += `${q.media_type ? escapeSql(q.media_type) : 'NULL'}, `;
      sql += `'${optionsJson}'::jsonb`;
      sql += `);\n`;
      totalCount++;
    }
    sql += '\n';
  }
  
  sql += `-- Total: ${totalCount} questions inserted\n`;
  
  const outputFile = 'import_questions.sql';
  fs.writeFileSync(outputFile, sql);
  console.log(`✅ Generated ${outputFile} with ${totalCount} INSERT statements`);
  console.log(`\n📋 Langkah: Copy-paste isi file ini ke Supabase SQL Editor dan jalankan`);
}

main();
