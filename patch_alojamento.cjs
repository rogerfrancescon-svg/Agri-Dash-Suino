const fs = require('fs');

let code = fs.readFileSync('src/components/VisitForm.tsx', 'utf8');

const target = `<input 
              type="date" 
              name="alojamentoDate"
              required
              value={formData.alojamentoDate || ''}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />`;

const replacement = `{(!isNewLote && formData.integradoNome && integrados.filter(i => i.name.toLowerCase() === formData.integradoNome?.toLowerCase()).length > 1) ? (
              <select
                name="alojamentoDate"
                required
                value={formData.alojamentoDate || ''}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {integrados
                  .filter(i => i.name.toLowerCase() === formData.integradoNome?.toLowerCase())
                  .sort((a, b) => new Date(b.alojamentoDate).getTime() - new Date(a.alojamentoDate).getTime())
                  .map(i => (
                    <option key={i.id} value={i.alojamentoDate}>
                      {i.alojamentoDate.split('-').reverse().join('/')} {i.status === 'Fechado' ? '(Fechado)' : ''}
                    </option>
                  ))
                }
              </select>
            ) : (
              <input 
                type="date" 
                name="alojamentoDate"
                required
                value={formData.alojamentoDate || ''}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/VisitForm.tsx', code);
console.log("Patched VisitForm.tsx");
