import { Router } from "express";

import {
  changePasswordSchema,
  updateUserSchema,
} from "../../db/schema/users.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  changePassword,
  listUsers,
  updateUser,
  getUserById,
} from "./usersController.js";

const router = Router();

router.put("/:id", verifyToken, validateData(updateUserSchema), updateUser);
router.put(
  "/:id/change-password",
  verifyToken,
  validateData(changePasswordSchema),
  changePassword
);
router.get("/", verifyToken, listUsers);
router.get("/:id", verifyToken, getUserById);

export default router;
