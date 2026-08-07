import type {
  categoryResponseSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../../db/schema/categories.js";
import type { z } from "zod";

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
