import { z } from "zod";
import { registerUserSchema, userResponseSchema } from "../../db/schema/users.js";

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type SafeUser = z.infer<typeof userResponseSchema>;
