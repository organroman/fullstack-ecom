import { pgTable, integer, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/helpers";
import { createInsertSchema } from "drizzle-zod";

export const categoriesStatusEnum = pgEnum("categoriesStatus", [
  "ACTIVE",
  "ARCHIVED",
]);

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  description: text(),
  icon_url: varchar({ length: 500 }),
  status: categoriesStatusEnum().notNull().default("ACTIVE"),
  display_order: integer().default(0),
  ...timestamps,
});

export const createCategorySchema = createInsertSchema(categoriesTable).omit({
  id: true,
  created_at: true,
});
