import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password mast be at least 6 characters "),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password mast be at least 6 characters "),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Invalid phone"),
  address: z.string().min(5, "Invalid address"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(4, "Old password is required"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match password",
  });
