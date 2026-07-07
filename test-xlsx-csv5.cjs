const XLSX = require('xlsx');
const fs = require('fs');

fs.writeFileSync('test_delim5.csv', Buffer.from('Data;Nome Integrado;Idade;Recomendação\n01/01/2023;Teste;10;Ação', 'latin1'));

const buf = fs.readFileSync('test_delim5.csv');
const wb = XLSX.read(buf, { type: 'buffer', raw: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const csv = XLSX.utils.sheet_to_csv(ws, { FS: '\t' });
console.log("XLSX parsed CSV:", csv);
