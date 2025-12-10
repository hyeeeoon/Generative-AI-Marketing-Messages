// import-fixed.js  ← 이 파일만 이렇게 만들면 끝!
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// 너의 실제 CSV 경로 (backend/database 폴더 안에 있음)
const CSV_FILE = './database/Telecom Customers Churn.csv';
// 만약 파일명이 다르면 아래 주석 풀고 써
// const CSV_FILE = './database/WA_Fn-UseC_-Telco-Customer-Churn.csv';

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'customer_db',
    port: 3306
  });

  const filePath = path.join(__dirname, CSV_FILE);

  if (!fs.existsSync(filePath)) {
    console.error('CSV 파일을 찾을 수 없어요!');
    console.error('찾는 경로:', filePath);
    console.log('\nbackend/database 폴더 안에 있는 파일들:');
    fs.readdirSync(path.join(__dirname, 'database')).forEach(f => console.log('  📄', f));
    process.exit(1);
  }

  console.log('CSV 파일 발견!', filePath);

  // 테이블 비우기
  await connection.execute('TRUNCATE TABLE customers');
  console.log('기존 데이터 삭제 완료');

  // CSV 읽기
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.trim().split(/\r?\n/);
  const values = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length < 20) continue;

    const totalCharges = row[19]?.trim() === '' ? '0' : row[19].trim();

    values.push([
      row[0].trim(), row[1].trim(),
      row[2].trim() === '1' ? 1 : 0,
      row[3].trim() || null, row[4].trim() || null,
      parseInt(row[5]) || 0,
      row[6].trim(), row[7].trim(), row[8].trim(), row[9].trim(),
      row[10].trim(), row[11].trim(), row[12].trim(), row[13].trim(),
      row[14].trim(), row[15].trim(), row[16].trim(), row[17].trim(),
      parseFloat(row[18]) || 0,
      parseFloat(totalCharges) || 0,
      row[20]?.trim() || 'No',
      null
    ]);
  }

  // 한 번에 삽입
  const placeholders = values.map(() => '(?' + ',?'.repeat(21) + ')').join(',');
  const sql = `INSERT INTO customers VALUES ${placeholders}`;
  await connection.query(sql, values.flat());

  console.log(`성공! 총 ${values.length}건 삽입 완료!`);
  console.log('이제 서버 재시작하고 http://localhost:5001/api/stats 확인해!!!');

  await connection.end();
}

run().catch(err => {
  console.error('삽입 실패:', err.message);
  process.exit(1);
});