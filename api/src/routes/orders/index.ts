import { Router } from "express";

import {
  insertOrderWithItemsSchema,
  updateOrderSchema,
} from "../../db/ordersSchema.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import { createOrder, gerOrderById, listOrders, updateOrder } from "./ordersController.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateData(insertOrderWithItemsSchema),
  createOrder
);

router.get("/", verifyToken, listOrders);
router.get("/:id", verifyToken, gerOrderById);
router.put("/:id", verifyToken,validateData(updateOrderSchema), updateOrder);

export default router;
