const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const target = '<span className="text-sm text-slate-700 truncate">{i.name}</span>';
const replacement = '<span className="text-sm text-slate-700 truncate">{i.name} {i.alojamentoDate ? `(${i.alojamentoDate.split(\'-\').reverse().join(\'/\')})` : \'\'}</span>';
code = code.replace(target, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched Dashboard.tsx");
