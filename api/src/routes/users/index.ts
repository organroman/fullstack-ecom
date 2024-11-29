import { Router } from "express";

import {
  changePasswordSchema,
  updateUserSchema,
} from "../../db/usersSchema.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifyToken } from "../../middlewares/authMiddleware";
import { changePassword, listUsers, updateUser } from "./usersController.js";

const router = Router();

router.put("/:id", verifyToken, validateData(updateUserSchema), updateUser);
router.put(
  "/:id/change-password",
  verifyToken,
  validateData(changePasswordSchema),
  changePassword
);
router.get("/", verifyToken, listUsers);

export default router;
