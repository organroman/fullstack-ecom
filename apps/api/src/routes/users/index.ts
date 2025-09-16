import { Router } from "express";

import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "../../db/schema/users.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifySeller, verifyToken } from "../../middlewares/authMiddleware.js";
import {
  changePassword,
  listUsers,
  updateUser,
  getUserById,
  createUser,
} from "./usersController.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifySeller,
  validateData(createUserSchema),
  createUser
);

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
