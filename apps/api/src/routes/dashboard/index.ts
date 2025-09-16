import { Router } from "express";
import { verifySeller } from "../../middlewares/authMiddleware";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  getRecentSalesByPeriod,
  getTotalRevenueByPeriod,
  getTotalSalesByPeriod,
  getTotalUsersByPeriod,
} from "./dashboardController";

const router = Router();

router.get("/revenue", verifyToken, verifySeller, getTotalRevenueByPeriod);
router.get("/users", verifyToken, verifySeller, getTotalUsersByPeriod);
router.get("/sales-total", verifyToken, verifySeller, getTotalSalesByPeriod);
router.get("/sales-recent", verifyToken, verifySeller, getRecentSalesByPeriod);

export default router;
