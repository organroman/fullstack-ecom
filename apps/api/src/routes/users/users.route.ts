import { Router } from "express";

import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "../../db/schema/users.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import {
  verifySeller,
  verifyToken,
  verifySelfOrElevated,
  verifyAdmin,
} from "../../middlewares/authMiddleware.js";
import {
  changePassword,
  listUsers,
  updateUser,
  getUserById,
  createUser,
} from "./users.controller.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifySeller,
  validateData(createUserSchema),
  createUser,
);

router.put(
  "/:id",
  verifyToken,
  verifySelfOrElevated,
  validateData(updateUserSchema),
  updateUser,
);
router.put(
  "/:id/change-password",
  verifyToken,
  verifySelfOrElevated,
  validateData(changePasswordSchema),
  changePassword,
);

router.get("/", verifyToken, verifyAdmin, listUsers);
router.get("/:id", verifyToken, getUserById);

export default router;
