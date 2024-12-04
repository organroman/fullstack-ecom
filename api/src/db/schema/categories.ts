import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/helpers";
import { createInsertSchema } from "drizzle-zod";

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  description: text(),
  icon_url: varchar({ length: 500 }),
  status: varchar({ length: 50 }).default("active"),
  display_order: integer().default(0),
  ...timestamps,
});

export const createCategorySchema = createInsertSchema(categoriesTable).omit({
  id: true,
  created_at: true,
});
