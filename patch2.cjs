const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const savedVisits = await storage.saveVisits(updatedVisits, [updatedVisit]);\n    setVisits([...savedVisits]);',
  'const savedVisits = await storage.saveVisits(updatedVisits, [updatedVisit]);\n    setVisits([...savedVisits]);\n    \n    // Create local backup to IndexedDB\n    await saveBackupToIndexedDB(integrados, updatedVisits);'
);

fs.writeFileSync('src/App.tsx', code);
