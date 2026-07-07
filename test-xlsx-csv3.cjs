const XLSX = require('xlsx');
const fs = require('fs');

fs.writeFileSync('test_delim3.csv', Buffer.from('Data;Nome Integrado;Idade\n01/01/2023;Teste;10', 'latin1'));

const buf = fs.readFileSync('test_delim3.csv');
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const csv = XLSX.utils.sheet_to_csv(ws, { FS: '\t' });
console.log("XLSX parsed CSV:", csv);
