const fs = require('fs');
let code = fs.readFileSync('src/components/Integrados.tsx', 'utf8');

const logicToAdd = `
                const diffTime = today.getTime() - alojaDate.getTime();
                const diffDays = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
                
                const batchVisits = visits.filter(v => v.integradoId === i.id);
                const latestVisit = batchVisits.length > 0 ? batchVisits.reduce((prev, current) => (new Date(prev.date) > new Date(current.date)) ? prev : current) : null;
                
                let consumoStr = '-';
                let consumoColor = 'text-slate-500';
                let consumoBg = 'bg-slate-100';
                let diferencaStr = '';
                let mortalidadeStr = '-';
                let mortalidadeColor = 'text-slate-500';
                let mortalidadeBg = 'bg-slate-100';

                if (latestVisit) {
                  if (latestVisit.consumoAcumuladoReal) {
                    const expected = getExpectedConsumption(latestVisit.idade);
                    const diff = latestVisit.consumoAcumuladoReal - expected;
                    consumoStr = \`\${latestVisit.consumoAcumuladoReal.toFixed(2)} kg\`;
                    diferencaStr = diff > 0 ? \`(+\${diff.toFixed(2)} kg)\` : \`(\${diff.toFixed(2)} kg)\`;
                    if (diff >= -5 && diff <= 5) {
                      consumoColor = 'text-emerald-700';
                      consumoBg = 'bg-emerald-100';
                    } else if (diff > 5) {
                      consumoColor = 'text-blue-700';
                      consumoBg = 'bg-blue-100';
                    } else {
                      consumoColor = 'text-red-700';
                      consumoBg = 'bg-red-100';
                    }
                  }

                  let mortPerc = 0;
                  let hasMort = false;
                  if (latestVisit.animaisAlojados && latestVisit.animaisAlojados > 0) {
                    const mortos = latestVisit.animaisMortos !== undefined ? latestVisit.animaisMortos : (latestVisit.mortalidade || 0);
                    mortPerc = (mortos / latestVisit.animaisAlojados) * 100;
                    hasMort = true;
                  } else if (latestVisit.mortalidade !== undefined) {
                    mortPerc = latestVisit.mortalidade;
                    hasMort = true;
                  }

                  if (hasMort) {
                    mortalidadeStr = \`\${mortPerc.toFixed(2)}%\`;
                    if (mortPerc <= 2.5) {
                      mortalidadeColor = 'text-emerald-700';
                      mortalidadeBg = 'bg-emerald-100';
                    } else if (mortPerc <= 4.0) {
                      mortalidadeColor = 'text-yellow-700';
                      mortalidadeBg = 'bg-yellow-100';
                    } else {
                      mortalidadeColor = 'text-red-700';
                      mortalidadeBg = 'bg-red-100';
                    }
                  }
                }
`;

code = code.replace(
  /const diffTime = today\.getTime\(\) - alojaDate\.getTime\(\);\n\s*const diffDays = Math\.max\(0, Math\.round\(diffTime \/ \(1000 \* 60 \* 60 \* 24\)\)\);/,
  logicToAdd
);

// Now I need to inject the columns.
// Currently there is:
// <td className="px-6 py-4 text-right whitespace-nowrap">
//   {editingId === i.id ? (
// ...
// This is the actions td.
// Wait, the "Idade" is NOT in a separate TD. It is rendered inside the actions TD?!
// Let's check exactly what the actions TD looks like.
