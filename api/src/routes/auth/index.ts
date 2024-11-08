import { Router } from "express";
import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";

import jwt from "jsonwebtoken";

import {
  createUserSchema,
  loginSchema,
  usersTable,
} from "../../db/usersSchema.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { db } from "../../db/index.js";

const router = Router();

router.post("/register", validateData(createUserSchema), async (req, res) => {
  try {
    const data = req.cleanBody;
    data.password = await bcryptjs.hash(data.password, 10);

    const [user] = await db.insert(usersTable).values(data).returning();
    //@ts-ignore
    delete user.password;

    res.status(201).json(user);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.post("/login", validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.cleanBody;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      res.status(401).json({ error: "Wrong username or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Wrong username or password" });
      return;
    }

    //create jwt token

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      "your-secret",
      { expiresIn: "30d" }
    );

    //@ts-ignore
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

export default router;
