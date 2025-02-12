import { z } from "zod";
import { EOrderStatus, Roles, Status } from "@/types/types";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password mast be at least 6 characters "),
  address: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password mast be at least 6 characters "),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number",
    })
    .transform((val) => Number(val)),
  images: z.array(
    z.object({
      image_link: z.string().min(1, "Image is required"),
    })
  ),
});

export const orderSchema = z.object({
  user_id: z.string().min(1, "Customer is required"),
  delivery_address: z.string().min(1, "Delivery address is required"),
  contact_phone: z.string(),
  status: z.nativeEnum(EOrderStatus),
  items: z.array(
    z.object({ product: createProductSchema, quantity: z.number() })
  ),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  icon_url: z.string().min(1, "Icon is required"),
  status: z.nativeEnum(Status),
  display_order: z
    .string()
    .min(1, "Order is required")
    .refine((val) => val === null || !isNaN(Number(val)), {
      message: "Order must be a valid number",
    })
    .transform((val) => Number(val)),
});

export const userSchema = z.object({
  role: z.nativeEnum(Roles),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string(),
  password: z.string().optional(),
});
