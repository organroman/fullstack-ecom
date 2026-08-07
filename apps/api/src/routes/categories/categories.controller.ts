import { Request, Response } from "express";
import {
  getAllCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "./categories.service.js";


export async function getCategories(req: Request, res: Response) {
  try {
    const searchPhrase =
      typeof req.query.search === "string" ? req.query.search : "";

    const categories = await getAllCategories(String(searchPhrase));
    res.status(200).json({
      categories,
    });
  } catch (e) {
    console.error("Error fetching categories:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const category = await createCategoryService(req.cleanBody);

    if (!category) {
      res.status(409).send({ message: "Category already exists" });
      return;
    }

    res.status(201).json(category);
  } catch (e) {
    console.error("Error creating category:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const slug = String(req.params.slug);
    const updatedFields = req.cleanBody;

    const category = await updateCategoryService(slug, updatedFields);

    if (!category) {
      res.status(404).send({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (e) {
    console.error("Error updating category:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const slug = String(req.params.slug);

    const deletedCategory = await deleteCategoryService(slug);

    if (!deletedCategory) {
      res.status(404).send({ message: "Category not found" });
      return;
    }

    res.status(204).send();
  } catch (e) {
    console.error("Error deleting category:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}
