import { Request, Response } from "express";
import { ilike } from "drizzle-orm";

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
