const XLSX = require('xlsx');
const fs = require('fs');
fs.writeFileSync('test_delim.csv', Buffer.from('Data;Integrado;Recomendação\n01/01/2023;Teste;Ação', 'utf8'));

const buf = fs.readFileSync('test_delim.csv');
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const csv = XLSX.utils.sheet_to_csv(ws, { FS: '\t' });
console.log("XLSX output:", csv);
