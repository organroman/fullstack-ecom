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
