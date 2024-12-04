import { Router } from "express";
import { verifySeller, verifyToken } from "../../middlewares/authMiddleware.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { createCategorySchema } from "../../db/schema/categories.js";
import { getCategories, createCategory } from "./categoriesController.js";

const router = Router();

router.get("/", getCategories);
router.post(
  "/",
  verifyToken,
  verifySeller,
  validateData(createCategorySchema),
  createCategory
);

export default router;
