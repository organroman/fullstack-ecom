import { Router } from "express";

import { registerUserSchema, loginSchema } from "../../db/schema/users.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { login, signUp } from "./auth.controller.js";

const router = Router();

router.post("/register", validateData(registerUserSchema), signUp);

router.post("/login", validateData(loginSchema), login);

export default router;
