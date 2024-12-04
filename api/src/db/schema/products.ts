import {
  integer,
  pgTable,
  varchar,
  text,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { timestamps } from "../../utils/helpers";
import { categoriesTable } from "./categories";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  
  category_id: integer()
    .references(() => categoriesTable.id)
    .notNull(),
  ...timestamps,
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  created_at: true,
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true,
  })
  .partial();
