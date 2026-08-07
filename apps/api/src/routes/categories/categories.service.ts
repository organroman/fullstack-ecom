import { and, eq, ilike, isNull } from "drizzle-orm";

import { db } from "../../db/index.js";
import { categoriesTable } from "../../db/schema/categories.js";
import type {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./categories.types.js";

export async function getAllCategories(
  search: string,
): Promise<CategoryResponse[]> {
  const categories = await db
    .select()
    .from(categoriesTable)
    .where(
      and(
        ilike(categoriesTable.name, `%${search}%`),
        isNull(categoriesTable.deleted_at),
      ),
    )
    .orderBy(categoriesTable.display_order);

  return categories;
}

export async function createCategory(
  categoryBody: CreateCategoryInput,
): Promise<CategoryResponse | null> {
  const [category] = await db
    .insert(categoriesTable)
    .values(categoryBody)
    .onConflictDoNothing({ target: categoriesTable.slug })
    .returning();

  return category;
}

export async function updateCategory(
  slug: string,
  updatedFields: UpdateCategoryInput,
): Promise<CategoryResponse | null> {
  const [category] = await db
    .update(categoriesTable)
    .set(updatedFields)
    .where(
      and(eq(categoriesTable.slug, slug), isNull(categoriesTable.deleted_at)),
    )
    .returning();

  return category || null;
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const [deletedCategory] = await db
    .update(categoriesTable)
    .set({ deleted_at: new Date() })
    .where(
      and(
        eq(categoriesTable.slug, slug),
        isNull(categoriesTable.deleted_at),
      ),
    )
    .returning();

  return !!deletedCategory;
}
