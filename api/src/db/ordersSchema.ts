import {
  integer,
  pgTable,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

import { usersTable } from "./usersSchema";
import { productsTable } from "./productsSchema";

export const orderStatusEnum = pgEnum("orderStatus", [
  "NEW",
  "PROCESSING",
  "CANCELLED",
  "SHIPPED",
  "SENT",
]);

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp().notNull().defaultNow(),
  status: orderStatusEnum().notNull().default("NEW"),

  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
});

export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer()
    .references(() => ordersTable.id)
    .notNull(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
});

export const insertOrderItemsSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemsSchema),
});

export const updateOrderSchema = createInsertSchema(ordersTable).pick({
  status: true,
});
