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
import { z } from "zod";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  price: doublePrecision().notNull(),

  category_id: integer()
    .references(() => categoriesTable.id)
    .notNull(),
  ...timestamps,
});

export const productImagesTable = pgTable("product_images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  image_link: text().notNull(),
  product_id: integer()
    .references(() => productsTable.id)
    .notNull(),
  ...timestamps,
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  created_at: true,
});

export const createProductImagesSchema = createInsertSchema(
  productImagesTable
).omit({
  id: true,
  product_id: true,
});

export const createProductWithImagesSchema = z.object({
  product: createProductSchema,
  images: z.array(createProductImagesSchema),
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true,
  })
  .partial();
