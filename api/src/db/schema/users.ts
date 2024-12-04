import { integer, pgTable, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { timestamps } from "../../utils/helpers";

export const rolesEnum = pgEnum("roles", [
  "ADMIN",
  "CUSTOMER",
  "SALES MANAGER",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 255 }),
  role: rolesEnum().notNull().default("CUSTOMER"),
  name: varchar({ length: 255 }),
  address: text(),
  ...timestamps,
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
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
