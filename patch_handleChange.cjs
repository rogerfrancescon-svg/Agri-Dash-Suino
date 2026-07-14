const fs = require('fs');

let code = fs.readFileSync('src/components/VisitForm.tsx', 'utf8');

const target = `    if (name === 'integradoNome') {`;

const replacement = `    if (name === 'integradoNome' || name === 'alojamentoDate') {
      const nomeToSearch = name === 'integradoNome' ? value : formData.integradoNome;
      const dateToSearch = name === 'alojamentoDate' ? value : undefined;
      
      if (nomeToSearch) {
        const matchingIntegrados = integrados.filter(i => i.name.toLowerCase() === nomeToSearch.toLowerCase());
        let integrado = undefined;
        
        if (matchingIntegrados.length > 0) {
          if (dateToSearch) {
             integrado = matchingIntegrados.find(i => i.alojamentoDate === dateToSearch);
          }
          
          if (!integrado) {
            const emAndamento = matchingIntegrados.filter(i => i.status === 'Em andamento');
            if (emAndamento.length > 0) {
               emAndamento.sort((a, b) => new Date(b.alojamentoDate).getTime() - new Date(a.alojamentoDate).getTime());
               integrado = emAndamento[0];
            } else {
               matchingIntegrados.sort((a, b) => new Date(b.alojamentoDate).getTime() - new Date(a.alojamentoDate).getTime());
               integrado = matchingIntegrados[0];
            }
          }
        }

        if (integrado) {
          if (!isNewLote) {
            if (name === 'integradoNome') {
              updates.alojamentoDate = integrado.alojamentoDate;
            }
            
            // Find previous visits for this integrado to auto-fill animaisAlojados and animaisMortos
            const integradoVisits = visits.filter(v => v.integradoId === integrado.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (integradoVisits.length > 0) {
              const lastVisit = integradoVisits[0];
              if (lastVisit.animaisAlojados) updates.animaisAlojados = lastVisit.animaisAlojados;
              if (lastVisit.animaisMortos) updates.animaisMortos = lastVisit.animaisMortos;
              if (lastVisit.mortalidade) updates.mortalidade = lastVisit.mortalidade;
              ['pesoAloj', 'pontuacaoSanitaria', 'cargaAlojamento', 'consumoAlojamento', 'cargaCrescimento1', 'consumoCrescimento1', 'cargaCrescimento2', 'consumoCrescimento2', 'cargaCrescimento3', 'consumoCrescimento3', 'cargaTerminacao1', 'consumoTerminacao1', 'cargaTerminacao2', 'consumoTerminacao2', 'volumeTotalCargas', 'consumoAcumuladoReal'].forEach(key => {
                if (lastVisit[key] !== undefined && lastVisit[key] !== null) updates[key] = lastVisit[key];
              });
            } else {
              // If we changed to a different lote that has NO visits yet, we should probably clear the auto-filled fields
              ['animaisAlojados', 'animaisMortos', 'mortalidade', 'pesoAloj', 'pontuacaoSanitaria', 'cargaAlojamento', 'consumoAlojamento', 'cargaCrescimento1', 'consumoCrescimento1', 'cargaCrescimento2', 'consumoCrescimento2', 'cargaCrescimento3', 'consumoCrescimento3', 'cargaTerminacao1', 'consumoTerminacao1', 'cargaTerminacao2', 'consumoTerminacao2', 'volumeTotalCargas', 'consumoAcumuladoReal'].forEach(key => {
                updates[key] = '';
              });
            }
          }
        }
      }
    }

    if (false) {`; // Just commenting out the old block

code = code.replace(`    if (name === 'integradoNome') {
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

      if (integrado) {
        if (!isNewLote) {
          updates.alojamentoDate = integrado.alojamentoDate;
          
          // Find previous visits for this integrado to auto-fill animaisAlojados and animaisMortos
          const integradoVisits = visits.filter(v => v.integradoId === integrado.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          if (integradoVisits.length > 0) {
            const lastVisit = integradoVisits[0];
            if (lastVisit.animaisAlojados) updates.animaisAlojados = lastVisit.animaisAlojados;
            if (lastVisit.animaisMortos) updates.animaisMortos = lastVisit.animaisMortos;
            if (lastVisit.mortalidade) updates.mortalidade = lastVisit.mortalidade;
            ['pesoAloj', 'pontuacaoSanitaria', 'cargaAlojamento', 'consumoAlojamento', 'cargaCrescimento1', 'consumoCrescimento1', 'cargaCrescimento2', 'consumoCrescimento2', 'cargaCrescimento3', 'consumoCrescimento3', 'cargaTerminacao1', 'consumoTerminacao1', 'cargaTerminacao2', 'consumoTerminacao2', 'volumeTotalCargas', 'consumoAcumuladoReal'].forEach(key => {
              if (lastVisit[key as keyof typeof lastVisit] !== undefined && lastVisit[key as keyof typeof lastVisit] !== null) updates[key] = lastVisit[key as keyof typeof lastVisit];
            });
          }
        }
      }
    }`, replacement);

fs.writeFileSync('src/components/VisitForm.tsx', code);
console.log("Patched handleChange in VisitForm.tsx");
