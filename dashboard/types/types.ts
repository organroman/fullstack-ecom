import { loginSchema, signUpSchema } from "@/lib/schema";
import { z } from "zod";

export type ProductType = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  created_at: string;
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
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type Categories = {
  categories: Category[];
};

export interface ICartItem {
  product: ProductType;
  quantity: number;
}

export interface IFavoriteItem {
  product: ProductType;
}

export enum Roles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SALES_MANAGER = "SALES MANAGER",
}

export interface IUser {
  id: number;
  role: Roles;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export enum EOrderStatuses {
  "NEW",
  "PROCESSING",
  "CANCELLED",
  "SHIPPED",
  "SENT",
}
export interface IOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: ProductType;
}

export type IOrder = {
  id: number;
  createdAt: Date;
  status: EOrderStatuses;
  user: IUser;
  items: IOrderItem[];
};

export interface IUsersOrder {
  id: number;
  createdAt: Date;
  status: EOrderStatuses;
  items: IOrderItem[];
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
export interface ProductFormModalData {
  id?: number;
  name: string;
  description: string;
  image: string;
  price: string;
}
export type LoginFormData = z.infer<typeof loginSchema>;
