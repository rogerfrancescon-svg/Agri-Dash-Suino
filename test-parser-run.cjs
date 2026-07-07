const fs = require('fs');
const { execSync } = require('child_process');

fs.writeFileSync('test-data.txt', 'Data;Nome Integrado;Lote;Idade;Animais Alojados;Recomendao;Mortalidade;Comedouro;Peso Aloj;Pontuao Sanitria;Colaborador;Consumo\n01/01/2023;Teste8;1;10;1000;Rao X;0;Auto;30.5;Excelente;Joo;100');

const script = `
import { preprocessImportData } from './src/utils/import-parser.ts';
import fs from 'fs';
const data = fs.readFileSync('test-data.txt', 'utf8');
const result = preprocessImportData(data);
console.log(JSON.stringify(result, null, 2));
`;
fs.writeFileSync('run-parser.ts', script);

try {
  const out = execSync('npx tsx run-parser.ts').toString();
  console.log(out);
} catch (e) {
  console.log(e.stdout.toString());
  console.log(e.stderr.toString());
}
