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

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
