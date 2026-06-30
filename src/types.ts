export interface Integrado {
  id: string;
  name: string;
  loteNumber?: string;
  alojamentoDate: string;
  status: 'Em andamento' | 'Fechado';
  fechamentoDate?: string;
}

export interface Visit {
  id: string;
  date: string;
  integradoId: string;
  idade: number; // in days
  recomendacao: string;
  comedouro: 'Linear' | 'Automático' | 'Misto';
  colaborador: string;
  consumoAcumuladoReal: number;
  mortalidade?: number;
}

export interface GrowthCurvePoint {
  dia: number;
  pesoInicial: number;
  pesoFinal: number;
  cmd: number;
  consumoAcumulado: number;
  gpd: number;
}
