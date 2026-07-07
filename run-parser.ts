
import { preprocessImportData } from './src/utils/import-parser.ts';
import fs from 'fs';
const data = fs.readFileSync('test-data.txt', 'utf8');
const result = preprocessImportData(data);
console.log(JSON.stringify(result, null, 2));
