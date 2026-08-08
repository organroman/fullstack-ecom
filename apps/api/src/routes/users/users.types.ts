import { z } from "zod";
import { updateUserSchema, createUserSchema } from "../../db/schema/users.js";
import type { SafeUser } from "../auth/auth.types.js";
import { RoleType } from "../../types/express/index.js";

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type ListUsersParams = {
  searchPhrase: string;
  filterRole: RoleType;
  page: number;
  limit: number;
};

export type PaginatedUsersResponse = {
  users: SafeUser[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};
