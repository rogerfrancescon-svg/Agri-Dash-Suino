import { Integrado, Visit } from '../types';

export interface PreProcessedData {
  integrados: Integrado[];
  visits: Visit[];
  logs: string[];
  errors: string[];
}

export function preprocessImportData(rawData: string): PreProcessedData {
  const lines = rawData.trim().split('\n');
  const integradosMap = new Map<string, Integrado>();
  const visits: Visit[] = [];
  const logs: string[] = [];
  const errors: string[] = [];

  let parsedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let dateStr, name, alojamentoStr, idadeStr, rec, comedouro, colab, consumoStr, mortStr;

    // 1. Try parsing as CSV/TSV first (semicolon, comma, or tab)
    // Detect the delimiter used in the line
    let delimiter = '';
    if (line.includes('\t')) delimiter = '\t';
    else if (line.includes(';')) delimiter = ';';
    else if (line.includes(',')) delimiter = ',';

    let parsed = false;
    if (delimiter) {
      // simple split (considering quotes if needed)
      const parts = line.split(new RegExp(`\\${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`)).map(p => p.replace(/^"|"$/g, '').trim());
      if (parts.length >= 7) {
        dateStr = parts[0];
        name = parts[1];
        alojamentoStr = parts[2];
        idadeStr = parts[3];
        rec = parts[4] || '';
        comedouro = parts[5] || 'Automático';
        colab = parts[6] || '';
        consumoStr = parts[7] || '0';
        mortStr = parts[8] || '0';
        parsed = true;
      }
    }

    if (!parsed) {
      // 2. Fallback to the original regex for raw text copy-paste
      const match = line.match(/^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+(-?\d+)\s+(.+?)\s+(Automático|Linear|Misto|Multitratos|Basculante|Robô|automático com\s+água|AUSTER)\s+([^\d]+)\s*([\d.,]*)\s*(\d*)$/i);
      if (match) {
        [, dateStr, name, alojamentoStr, idadeStr, rec, comedouro, colab, consumoStr, mortStr] = match;
        parsed = true;
      }
    }

    if (!parsed) {
      logs.push(`Aviso: Linha ${i + 1} não reconhecida e será ignorada.`);
      continue;
    }

    // Skip header rows by checking if dateStr looks like a date and not the word "Data" or "Date"
    if (dateStr?.toLowerCase().includes('data') || name?.toLowerCase().includes('nome') || name?.toLowerCase().includes('integrado')) {
      continue;
    }

    // Normalization and Validation Helpers
    const formatDate = (dStr: string) => {
      if (!dStr) return '';
      if (dStr.includes('-')) {
        const p = dStr.split('-');
        return p[0].length === 4 ? dStr : `${p[2]}-${p[1]}-${p[0]}`;
      }
      if (dStr.includes('/')) {
        const p = dStr.split('/');
        return p[0].length === 4 ? dStr.replace(/\//g, '-') : `${p[2]}-${p[1]}-${p[0]}`;
      }
      return dStr;
    };

    const finalDateStr = formatDate(dateStr!);
    const finalAlojamentoStr = formatDate(alojamentoStr!);
    
    const parsedDate = new Date(finalDateStr);
    const parsedAlojamento = new Date(finalAlojamentoStr);
    
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Erro na linha ${i + 1}: Data da visita inválida (${dateStr})`);
      continue;
    }
    
    if (isNaN(parsedAlojamento.getTime())) {
      errors.push(`Erro na linha ${i + 1}: Data de alojamento inválida (${alojamentoStr})`);
      continue;
    }

    // Calculate age correctly
    let calculatedIdade = parseInt(idadeStr || '0', 10) || 0;
    const diffTime = parsedDate.getTime() - parsedAlojamento.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= -10 && diffDays <= 200) { 
        calculatedIdade = diffDays;
    }

    // Consider closed if age > 120 days
    const isClosed = calculatedIdade > 120;

    // Fix names and IDs
    name = name!.trim();
    if (!name) {
      errors.push(`Erro na linha ${i + 1}: Nome do integrado não encontrado.`);
      continue;
    }
    
    const id = `i_${name.replace(/\s+/g, '').toLowerCase()}`;

    if (!integradosMap.has(id)) {
      integradosMap.set(id, {
        id,
        name,
        alojamentoDate: finalAlojamentoStr,
        status: isClosed ? 'Fechado' : 'Em andamento'
      });
    } else if (isClosed) {
      const existing = integradosMap.get(id);
      if (existing) {
        existing.status = 'Fechado';
      }
    }

    let parsedComedouro = 'Automático';
    const cLow = (comedouro || '').toLowerCase();
    if (cLow.includes('linear')) parsedComedouro = 'Linear';
    if (cLow.includes('misto')) parsedComedouro = 'Misto';

    // Handle numbers with comma or dot for consumption
    let consumo = parseFloat((consumoStr || '0').replace(/\./g, '').replace(',', '.')) || 0;
    if (consumo < 0 || isNaN(consumo)) consumo = 0;
    
    // Normalization for mortality (often imported with dots like 1.000 instead of 1000 or trailing spaces)
    let mortStrClean = (mortStr || '0').trim().replace(/\./g, '');
    let mort = parseInt(mortStrClean, 10);
    if (isNaN(mort) || mort < 0) mort = 0;

    if (consumo === 0 && rec) {
      const recMatch = rec.match(/consumo.*?(?:de\s+)?([\d.,]+)\s*kg/i);
      if (recMatch) {
        consumo = parseFloat(recMatch[1].replace(',', '.'));
      }
    }

    // Sometimes mortality is inside the recommendation string or missed
    if (mort === 0 && rec) {
      const mortMatch = rec.match(/mortalidade.*?(?:de\s+)?(\d+)/i);
      if (mortMatch) {
        mort = parseInt(mortMatch[1], 10);
      }
    }

    visits.push({
      id: `v_${id}_${i}`,
      integradoId: id,
      date: finalDateStr,
      idade: calculatedIdade,
      recomendacao: (rec || '').trim(),
      comedouro: parsedComedouro as 'Automático' | 'Linear' | 'Misto',
      colaborador: (colab || '').trim(),
      consumoAcumuladoReal: consumo,
      mortalidade: mort
    });

    parsedCount++;
  }

  logs.push(`Pré-processamento concluído: ${parsedCount} registros válidos.`);
  
  return {
    integrados: Array.from(integradosMap.values()),
    visits,
    logs,
    errors
  };
}
