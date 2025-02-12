import { Router } from "express";

import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteImage,
} from "./productsController.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { createProductWithImagesSchema } from "../../db/schema/products.js";
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
  validateData(createProductWithImagesSchema),
  updateProduct
);

router.delete("/:id", verifyToken, verifySeller, deleteProduct);
router.delete("/images/:id", verifyToken, verifySeller, deleteImage);

export default router;
