import { z } from "zod";

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
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  price: z
    .string()
    .min(1, "Price is required") // Ensure it's not empty
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number",
    }) 
    .transform((val) => Number(val)),
});
