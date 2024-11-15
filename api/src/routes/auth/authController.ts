import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { db } from "../../db/index.js";
import {
  createUserSchema,
  loginSchema,
  usersTable,
} from "../../db/usersSchema.js";

export async function signUp(req: Request, res: Response) {
  try {
    const data = req.cleanBody;
    data.password = await bcryptjs.hash(data.password, 10);

    const [user] = await db.insert(usersTable).values(data).returning();
    //@ts-ignore
    delete user.password;

    res.status(201).json(user);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error: error });
  }
}

export async function login(req: Request, res: Response) {
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
}
