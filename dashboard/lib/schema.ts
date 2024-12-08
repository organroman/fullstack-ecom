import { z } from "zod";
import { Status } from "@/types/types";

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
    z.object({ image_link: z.string().min(1, "Image is required") })
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
