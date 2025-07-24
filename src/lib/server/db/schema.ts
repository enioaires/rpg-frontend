import { pgTable, serial, varchar, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';

// Tabela de usuários - super simples
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	name: varchar('name', { length: 255 }).notNull(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabela de personagens - a ficha inteira fica no JSONB
export const characters = pgTable('characters', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	data: jsonb('data').notNull(), // Toda a ficha RPG fica aqui
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Types para TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;