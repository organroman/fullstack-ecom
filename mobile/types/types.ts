import {
  changePasswordSchema,
  loginSchema,
  signUpSchema,
  updateUserSchema,
} from "@/utils/schema";
import { z } from "zod";

export type Product = {
  id: number;
  name: string;
  description: string;
  images: ProductImage[];
  price: number;
  category_id: number;
};

export type Products = {
  products: Product[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type ProductImage = {
  id: number;
  image_link: string;
  product_id: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  status: "ACTIVE" | "ARCHIVED";
  display_order: number;
};

export type Categories = {
  categories: Category[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type FavoriteItem = {
  product: Product;
};

export type User = {
  id: number;
  email: string;
  role: string;
  name: string;
  address: string;
  phone: string;
};

export type UpdatedUser = {
  user: User;
  token: string;
};

export type Order = {
  id: number;
  createdAt: string;
  status: "New" | "Delivered" | "Cancelled";
  delivery_address: string;
  contact_phone: string;
  user: User;
  items: CartItem[];
};

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
