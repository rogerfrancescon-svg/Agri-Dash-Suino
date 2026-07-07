const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { saveBackupToIndexedDB }")) {
  code = code.replace("import { supabase } from './lib/supabase';", "import { supabase } from './lib/supabase';\nimport { saveBackupToIndexedDB } from './lib/backup';");
}

code = code.replace(
  'const savedVisits = await storage.saveVisits(updatedVisits, [newVisit]);\n    setVisits([...savedVisits]);',
  'const savedVisits = await storage.saveVisits(updatedVisits, [newVisit]);\n    setVisits([...savedVisits]);\n    \n    // Create local backup to IndexedDB\n    await saveBackupToIndexedDB(integrados, updatedVisits);'
);

fs.writeFileSync('src/App.tsx', code);
