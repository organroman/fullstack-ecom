import { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";

import { db } from "../../db/index.js";
import { categoriesTable } from "../../db/schema/categories.js";

export async function getCategories(req: Request, res: Response) {
  try {
    const searchPhrase = req.query.search || "";

    const categories = await db
      .select()
      .from(categoriesTable)
      .where(ilike(categoriesTable.name, `%${searchPhrase}%`))
      .orderBy(categoriesTable.display_order);

    res.status(200).json({
      categories,
    });
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const [category] = await db
      .insert(categoriesTable)
      .values(req.cleanBody)
      .returning();
    res.status(201).json(category);
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const updatedFields = req.cleanBody;

    const [category] = await db
      .update(categoriesTable)
      .set(updatedFields)
      .where(eq(categoriesTable.slug, id))
      .returning();

    if (category) {
      res.status(200).json(category);
    } else res.status(404).send({ message: "Category not found" });
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const [deletedCategory] = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.slug, id))
      .returning();

    if (deletedCategory) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
