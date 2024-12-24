import { Router } from "express";

import {
  insertOrderWithItemsSchema,
  updateOrderSchema,
} from "../../db/schema/orders.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  // gerOrdersByUserId,
  // gerOrderByIdAndUserId,
} from "./ordersController.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateData(insertOrderWithItemsSchema),
  createOrder
);

router.get("/", verifyToken, listOrders);
router.get("/:id", verifyToken, getOrderById);
// router.get("/user/:userId", verifyToken, gerOrdersByUserId);
// router.get("/:orderId/user/:userId", verifyToken, gerOrderByIdAndUserId);
router.put("/:id", verifyToken, validateData(updateOrderSchema), updateOrder);

export default router;
