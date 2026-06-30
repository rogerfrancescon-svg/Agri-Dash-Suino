import React, { useState } from 'react';
import { Visit, Integrado } from '../types';
import { getExpectedConsumption } from '../data';
import { Search } from 'lucide-react';

interface VisitsListProps {
  visits: Visit[];
  integrados: Integrado[];
  onEditVisit: (id: string) => void;
}

export function VisitsList({ visits, integrados, onEditVisit }: VisitsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort by date descending
  const sortedVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredVisits = sortedVisits.filter(v => {
    const integrado = integrados.find(i => i.id === v.integradoId);
    return integrado?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           v.recomendacao.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
         <div className="relative w-full md:max-w-sm">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Buscar por cliente ou recomendação..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
           />
         </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
            <tr>
                <th className="px-5 py-4 border-b border-slate-200">Data Visita</th>
                <th className="px-5 py-4 border-b border-slate-200">Integrado</th>
                <th className="px-5 py-4 border-b border-slate-200">Lote</th>
                <th className="px-5 py-4 border-b border-slate-200">Alojamento</th>
                <th className="px-5 py-4 border-b border-slate-200">Idade</th>
                <th className="px-5 py-4 border-b border-slate-200">Consumo (Real vs Esp)</th>
                <th className="px-5 py-4 border-b border-slate-200">Mortalidade</th>
                <th className="px-5 py-4 border-b border-slate-200">Comedouro</th>
                <th className="px-5 py-4 border-b border-slate-200">Status</th>
                <th className="px-5 py-4 border-b border-slate-200 w-64">Recomendações</th>
                <th className="px-5 py-4 border-b border-slate-200">Técnico</th>
                <th className="px-5 py-4 border-b border-slate-200 w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-5 py-8 text-center text-slate-500">Nenhuma visita encontrada.</td>
                </tr>
              ) : filteredVisits.map((v) => {
                const integrado = integrados.find(i => i.id === v.integradoId);
                const expected = getExpectedConsumption(v.idade);
                const diff = (v.consumoAcumuladoReal - expected).toFixed(2);
                const isWarning = Math.abs(Number(diff)) > 5;

                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">{
                      new Date(Number(v.date.split('-')[0]), Number(v.date.split('-')[1]) - 1, Number(v.date.split('-')[2])).toLocaleDateString('pt-BR')
                    }</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{integrado?.name || 'Desconhecido'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">{integrado?.loteNumber || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">{integrado?.alojamentoDate ? new Date(Number(integrado.alojamentoDate.split('-')[0]), Number(integrado.alojamentoDate.split('-')[1]) - 1, Number(integrado.alojamentoDate.split('-')[2])).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{v.idade} dias</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{v.consumoAcumuladoReal} kg</span>
                        <span className="text-xs text-slate-500">Esp: {expected} kg</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{v.mortalidade !== undefined ? `${v.mortalidade}%` : '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">{v.comedouro || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isWarning ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                          Atenção ({diff}kg)
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                          Ótimo
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs leading-relaxed" title={v.recomendacao}>
                        {v.recomendacao}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">{v.colaborador}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => onEditVisit(v.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
