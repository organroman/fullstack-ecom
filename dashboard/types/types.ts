import { loginSchema, signUpSchema } from "@/lib/schema";
import { z } from "zod";

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
};

export interface ICartItem {
  product: Product;
  quantity: number;
}

export interface IFavoriteItem {
  product: Product;
}

export interface IUser {
  id: number;
  email: string;
  role: string;
  name: string;
  address: string;
}

export enum EOrderStatuses {
  new = "New",
  cancelled = "Cancelled",
  paid = "Paid",
  shipped = "Shipped",
  delivered = "Delivered",
}
export interface IOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface IOrder {
  id: number;
  createdAt: Date;
  status: EOrderStatuses;
  user: IUser;
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
