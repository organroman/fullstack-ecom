import { loginSchema, signUpSchema, updateUserSchema } from "@/utils/schema";
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
  phone: string;
}

export interface IUserOrder {
  id: number;
  createdAt: string;
  status: "New" | "Delivered" | "Cancelled";
  userId: number;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: Product;
  }[];
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
