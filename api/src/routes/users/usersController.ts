import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { count, eq } from "drizzle-orm";

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
    let { oldPassword, password } = req.body;
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

export async function listUsers(req: Request, res: Response) {
  try {
    const userRole = req.role;

    if (userRole !== "ADMIN") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const users = await db
      .select()
      .from(usersTable)
      .limit(limit)
      .offset(offset);

    const totalUsers = await db.select({ count: count() }).from(usersTable);
    const totalPages = Math.ceil(totalUsers[0].count / limit);

    const usersWoPass = users.map(
      ({ id, email, phone, name, role, address, createdAt }) => {
        return {
          id,
          email,
          phone,
          name,
          role,
          address,
          createdAt,
        };
      }
    );

    res.status(200).json({
      users: usersWoPass,
      total: totalUsers[0].count,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
