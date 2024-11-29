import { loginSchema, signUpSchema } from "@/lib/schema";
import { z } from "zod";

export type ProductType = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
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
  SALES_MANAGER = "SALES MANAGER", // Consistent naming with enum keys
}

export interface IUser {
  id: number;
  email: string;
  role: Roles;
  name: string;
  address: string;
  createdAt: string;
  phone: string;
}

export enum EOrderStatuses {
  "New",
  "Cancelled",
  "Paid",
  "Shipped",
  "Delivered",
}
export interface IOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: ProductType;
}

export interface IOrder {
  id: number;
  createdAt: Date;
  status: EOrderStatuses;
  user: IUser;
  items: IOrderItem[];
}

export interface IUsersOrder {
  id: number;
  createdAt: Date;
  status: EOrderStatuses;
  items: IOrderItem[];
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
export interface CreateProductFormData {
  name: string;
  description: string;
  image: string;
  price: string;
}
export type LoginFormData = z.infer<typeof loginSchema>;
