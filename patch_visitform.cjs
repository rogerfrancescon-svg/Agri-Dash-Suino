const fs = require('fs');
let code = fs.readFileSync('src/components/VisitForm.tsx', 'utf8');

const target = `    if (name === 'integradoNome') {
      const integrado = integrados.find(i => i.name.toLowerCase() === value.toLowerCase());
      if (integrado) {`;

const replacement = `    if (name === 'integradoNome') {
      const matchingIntegrados = integrados.filter(i => i.name.toLowerCase() === value.toLowerCase());
      let integrado = undefined;
      if (matchingIntegrados.length > 0) {
        const emAndamento = matchingIntegrados.filter(i => i.status === 'Em andamento');
        if (emAndamento.length > 0) {
           emAndamento.sort((a, b) => new Date(b.alojamentoDate).getTime() - new Date(a.alojamentoDate).getTime());
           integrado = emAndamento[0];
        } else {
           matchingIntegrados.sort((a, b) => new Date(b.alojamentoDate).getTime() - new Date(a.alojamentoDate).getTime());
           integrado = matchingIntegrados[0];
        }
      }

      if (integrado) {`;

code = code.replace(target, replacement);

const optionTarget = `{Array.from(new Set(integrados.map(i => i.name))).map(name => (
                <option key={name} value={name} />
              ))}`;
const optionReplacement = `{Array.from(new Set(integrados.filter(i => i.status === 'Em andamento').map(i => i.name))).map(name => (
                <option key={name} value={name} />
              ))}`;

// Maybe we shouldn't filter the datalist to ONLY em andamento? The user might want to edit a closed one, but VisitForm is usually for new visits.
// User said: "nao esta puxando todos os lotes em andamento" wait...
// User said: "não está puxando todos os lotes em andamento, ou não está puxando o ultimo lote Alojado quando digita e seleciona o nome do integrado"
// Let's replace the option list just to include all, but if we do new Set(integrados.map(i=>i.name)) it includes all anyway.
// I will not touch the datalist for now, just the change to find the right integrado.

fs.writeFileSync('src/components/VisitForm.tsx', code);
console.log("VisitForm patched");
