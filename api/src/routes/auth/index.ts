import { Router } from "express";

import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} from "../../db/usersSchema.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { login, signUp, updateUser } from "./authController.js";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/register", validateData(createUserSchema), signUp);

router.post("/login", validateData(loginSchema), login);

router.put(
  "/user/:id",
  verifyToken,
  validateData(updateUserSchema),
  updateUser
);

export default router;
