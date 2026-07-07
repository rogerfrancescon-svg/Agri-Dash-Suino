const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'await saveBackupToIndexedDB(integrados, updatedVisits);',
  'await saveBackupToIndexedDB();'
).replace(
  'await saveBackupToIndexedDB(integrados, updatedVisits);',
  'await saveBackupToIndexedDB();'
);

fs.writeFileSync('src/App.tsx', code);
