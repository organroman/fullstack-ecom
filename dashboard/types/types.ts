import { loginSchema, signUpSchema } from "@/lib/schema";
import { QueryClient } from "@tanstack/react-query";
import { z } from "zod";

export type Product = {
  id: number;
  name: string;
  description: string;
  images: ProductImage[];
  category_id: string;
  price: number;
  created_at: string;
};

export type Products = {
  products: Product[];
  page: number;
  total: number;
  limit: number;
  totalPages: number;
};

export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export type View = "grid" | "table";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  status: Status;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Categories = {
  categories: Category[];
};

export enum Roles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SALES_MANAGER = "SALES MANAGER",
}

export type User = {
  id?: string;
  role: Roles;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  password?: string;
};

export type Users = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export enum EOrderStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  CANCELLED = "CANCELLED",
  SHIPPED = "SHIPPED",
  SENT = "SENT",
}
export type OrderItem = {
  id?: number;
  order_id?: number;
  quantity: number;
  price: number;
  product: Product;
};

export type Order = {
  id: number;
  created_at: Date;
  status: EOrderStatus;
  delivery_address: string;
  contact_phone: string;
  user: User;
  items: OrderItem[];
};

export type Orders = {
  orders: Order[];
  limit: number;
  total: number;
  page: number;
  totalPages: number;
};

export type SignUpFormData = z.infer<typeof signUpSchema>;

export type CategoryFormModalData = {
  id?: number | string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  status: Status;
  display_order: string;
};

type OrderItemCreate = {
  product: Product;
  quantity: number;
};

export type CreateOrderFormData = {
  user_id: string;
  delivery_address: string;
  contact_phone: string;
  status: EOrderStatus;
  items: OrderItemCreate[];
};

export type ProductImage = {
  id?: string;
  image_link: string;
};
export interface ProductFormModalData {
  id?: number;
  name: string;
  description: string;
  images: ProductImage[];
  category_id: string;
  price: string;
}

export type LoginFormData = z.infer<typeof loginSchema>;

export type UserFormModalData = {
  id?: string;
  role: Roles;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
};

export interface UseQueryProps {
  closeDialog: () => void;
  queryClient: QueryClient;
  token: string | null;
}

export interface UseProductProps extends UseQueryProps {
  view: View;
}

export interface UseProductWithIdProps extends UseProductProps {
  id: number;
}
