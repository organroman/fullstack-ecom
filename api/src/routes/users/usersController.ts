import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { usersTable } from "../../db/usersSchema.js";

export async function updateUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const updatedFields = req.cleanBody;

    const [updatedUser] = await db
      .update(usersTable)
      .set(updatedFields)
      .where(eq(usersTable.id, id))
      .returning();

    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
    } else res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    console.log("🚀 ~ id:", id);
    let { oldPassword, password } = req.body;
    console.log("🚀 ~ oldPassword:", oldPassword);
    console.log("clean body", req.cleanBody);
    password = await bcryptjs.hash(password, 10);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Wrong old password" });
      return;
    }
    console.log("🚀 ~ isMatch:", isMatch);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      "your-secret",
      { expiresIn: "30d" }
    );

    const [updatedUser] = await db
      .update(usersTable)
      .set({ password: password })
      .where(eq(usersTable.id, id))
      .returning();

    //@ts-ignore
    delete updatedUser.password;
    res.status(200).json({ updatedUser, token });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
}
