const fs = require('fs');
let code = fs.readFileSync('src/components/VisitForm.tsx', 'utf8');

code = code.replace(/lastVisit\[key\]/g, 'lastVisit[key as keyof typeof lastVisit]');
fs.writeFileSync('src/components/VisitForm.tsx', code);
