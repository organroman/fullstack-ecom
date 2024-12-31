import {
  integer,
  pgTable,
  doublePrecision,
  pgEnum,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

import { usersTable } from "./users";
import { productsTable } from "./products";
import { timestamps } from "../../utils/helpers";

export const orderStatusEnum = pgEnum("orderStatus", [
  "NEW",
  "PROCESSING",
  "CANCELLED",
  "SHIPPED",
  "SENT",
]);

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  status: orderStatusEnum().notNull().default("NEW"),
  delivery_address: text().notNull(),
  contact_phone: varchar({ length: 255 }).notNull(),

  user_id: integer()
    .references(() => usersTable.id)
    .notNull(),
  ...timestamps,
});

export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer()
    .references(() => ordersTable.id)
    .notNull(),
  product_id: integer()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
  ...timestamps,
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  user_id: true,
  delivery_address: true,
  contact_phone: true,
  status: true,
  created_at: true,
  updated_at: true,
});

export const insertOrderItemsSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  order_id: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemsSchema),
});

export const updateOrderSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemsSchema),
});
