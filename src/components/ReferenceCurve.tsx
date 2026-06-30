import React from 'react';
import { growthCurve } from '../data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ReferenceCurve() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Curva de Consumo Acumulado Esperado</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthCurve} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="dia" label={{ value: 'Idade (Dias)', position: 'insideBottom', offset: -10 }} stroke="#64748b" fontSize={12} />
            <YAxis label={{ value: 'Consumo (kg)', angle: -90, position: 'insideLeft' }} stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="consumoAcumulado" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider p-6 bg-white border-b border-slate-200">Programas Alimentares (Fases)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600 min-w-[600px]">
            <thead className="bg-[#2D452B] text-white font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">FASE</th>
                <th className="px-4 py-3">Aloj</th>
                <th className="px-4 py-3">C1</th>
                <th className="px-4 py-3">C2</th>
                <th className="px-4 py-3">C3</th>
                <th className="px-4 py-3">T1</th>
                <th className="px-4 py-3">T2</th>
                <th className="px-4 py-3 bg-[#1A3A5B]">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-left font-bold bg-[#2D452B] text-white whitespace-nowrap">Dias de Consumo</td>
                <td className="px-4 py-3">14</td>
                <td className="px-4 py-3">18</td>
                <td className="px-4 py-3">14</td>
                <td className="px-4 py-3">18</td>
                <td className="px-4 py-3">10</td>
                <td className="px-4 py-3">22</td>
                <td className="px-4 py-3 font-bold bg-[#1A3A5B] text-white">96</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-left font-bold bg-[#2D452B] text-white whitespace-nowrap">Qtdade ração/ fase</td>
                <td className="px-4 py-3">17,00</td>
                <td className="px-4 py-3">30,82</td>
                <td className="px-4 py-3">30,67</td>
                <td className="px-4 py-3">45,71</td>
                <td className="px-4 py-3">27,49</td>
                <td className="px-4 py-3">63,15</td>
                <td className="px-4 py-3 font-bold bg-[#1A3A5B] text-white">214,85</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-left font-bold bg-[#2D452B] text-white whitespace-nowrap">CMD</td>
                <td className="px-4 py-3">1,21</td>
                <td className="px-4 py-3">1,71</td>
                <td className="px-4 py-3">2,19</td>
                <td className="px-4 py-3">2,54</td>
                <td className="px-4 py-3">2,75</td>
                <td className="px-4 py-3">2,87</td>
                <td className="px-4 py-3 font-bold bg-[#1A3A5B] text-white">2,238</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm text-slate-600 min-w-[600px]">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dia</th>
                <th className="px-4 py-3">Peso Inicial (kg)</th>
                <th className="px-4 py-3">Peso Final (kg)</th>
                <th className="px-4 py-3">Consumo Diário (CMD)</th>
                <th className="px-4 py-3">Consumo Acumulado (kg)</th>
                <th className="px-4 py-3">Ganho Diário (GPD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {growthCurve.map((row) => (
                <tr key={row.dia} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.dia}</td>
                  <td className="px-4 py-3">{row.pesoInicial.toFixed(2)}</td>
                  <td className="px-4 py-3">{row.pesoFinal.toFixed(2)}</td>
                  <td className="px-4 py-3">{row.cmd.toFixed(3)}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">{row.consumoAcumulado.toFixed(2)}</td>
                  <td className="px-4 py-3">{row.gpd.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
