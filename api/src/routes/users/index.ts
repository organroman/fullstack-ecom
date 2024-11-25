import { Router } from "express";

import { updateUserSchema } from "../../db/usersSchema.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { verifyToken } from "../../middlewares/authMiddleware";
import { changePassword, updateUser } from "./usersController.js";

const router = Router();

router.put("/:id", verifyToken, validateData(updateUserSchema), updateUser);
router.put(
  "/:id/change-password",
  verifyToken,
  validateData(updateUserSchema),
  changePassword
);

export default router;
