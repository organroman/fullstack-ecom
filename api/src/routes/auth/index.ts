import { Router } from "express";

import { createUserSchema, loginSchema } from "../../db/schema/users.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { login, signUp } from "./authController.js";

const router = Router();

router.post("/register", validateData(createUserSchema), signUp);

router.post("/login", validateData(loginSchema), login);

export default router;
