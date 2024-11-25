import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 255 }),
  role: varchar({ length: 255 }).notNull().default("user"),
  name: varchar({ length: 255 }),
  address: text(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  role: true,
});

export const loginSchema = createInsertSchema(usersTable).pick({
  email: true,
  password: true,
});

export const updateUserSchema = createInsertSchema(usersTable)
  .omit({
    id: true,
  })
  .partial();

export const changePasswordSchema = createInsertSchema(usersTable).pick({
  password: true,
});
