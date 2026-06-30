import { pgTable, text, timestamp, integer, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const integrados = pgTable('integrados', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  loteNumber: text('lote_number'),
  alojamentoDate: text('alojamento_date').notNull(),
  status: text('status').notNull(), // 'Em andamento' | 'Fechado'
  fechamentoDate: text('fechamento_date'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const visits = pgTable('visits', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  integradoId: text('integrado_id').notNull().references(() => integrados.id, { onDelete: 'cascade' }),
  idade: integer('idade').notNull(), // in days
  recomendacao: text('recomendacao').notNull(),
  comedouro: text('comedouro').notNull(), // 'Linear' | 'Automático' | 'Misto'
  colaborador: text('colaborador').notNull(),
  consumoAcumuladoReal: real('consumo_acumulado_real').notNull(),
  mortalidade: integer('mortalidade').default(0),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

