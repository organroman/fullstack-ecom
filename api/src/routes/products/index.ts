import { Router } from "express";

import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productsController.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import {
  createProductSchema,
  createProductWithImagesSchema,
  updateProductSchema,
} from "../../db/schema/products.js";
import { verifySeller, verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  verifyToken,
  verifySeller,
  validateData(createProductWithImagesSchema),
  createProduct
);

router.put(
  "/:id",
  verifyToken,
  verifySeller,
  validateData(updateProductSchema),
  updateProduct
);

router.delete("/:id", verifyToken, verifySeller, deleteProduct);

export default router;
