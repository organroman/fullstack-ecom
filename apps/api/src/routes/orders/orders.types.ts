import { z } from "zod";
import {
  insertOrderWithItemsSchema,
  updateOrderWithItemsSchema,
  ordersTable,
  orderItemsTable,
} from "../../db/schema/orders.js";
import type { productsTable } from "../../db/schema/products.js";
import type { usersTable } from "../../db/schema/users.js";
import type { Image } from "../products/products.types.js";
import { OrderStatusType, RoleType } from "../../types/express/index.js";

export type CreateOrderInput = z.infer<typeof insertOrderWithItemsSchema>;

export type UpdateOrderInput = z.infer<typeof updateOrderWithItemsSchema>;

type ProductRow = typeof productsTable.$inferSelect;
type OrderRow = typeof ordersTable.$inferSelect;
type OrderItemRow = typeof orderItemsTable.$inferSelect;
type UserRow = typeof usersTable.$inferSelect;

export type OrderItemProduct = Pick<
  ProductRow,
  "id" | "name" | "description"
> & {
  images: Image[];
};

export type OrderItemWithProduct = Pick<
  OrderItemRow,
  "id" | "quantity" | "price"
> & {
  product: OrderItemProduct | null;
};

export type OrderUser = Pick<
  UserRow,
  "id" | "name" | "email" | "phone" | "address" | "role"
>;

export type OrderWithItemsDetails = Omit<OrderRow, "user_id"> & {
  items: OrderItemWithProduct[];
  user: OrderUser;
};

export type PaginatedOrdersResponse = {
  orders: OrderWithItemsDetails[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

export type ListOrdersParams = {
  searchPhrase: string;
  status: OrderStatusType | undefined;
  page: number;
  limit: number;
  role: RoleType;
  userId: number;
};
