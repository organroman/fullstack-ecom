import { Router } from "express";
import { verifySeller, verifyToken } from "../../middlewares/authMiddleware.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../db/schema/categories.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.controller.js";

const router = Router();

router.get("/", getCategories);
router.post(
  "/",
  verifyToken,
  verifySeller,
  validateData(createCategorySchema),
  createCategory
);

router.put(
  "/:slug",
  verifyToken,
  verifySeller,
  validateData(updateCategorySchema),
  updateCategory
);

router.delete("/:slug", verifyToken, verifySeller, deleteCategory);

export default router;
