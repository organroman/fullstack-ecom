import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { ilike, eq, or, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema/users.js";
import { TokenPayload } from "../../middlewares/authMiddleware.js";
import { RoleType } from "../../types/express/index.js";

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

export async function createUser(req: Request, res: Response) {
  try {
    const data = req.cleanBody;
    data.password = await bcryptjs.hash(data.password, 10);

    const [user] = await db
      .insert(usersTable)
      .values(req.cleanBody)
      .returning();
    //@ts-ignore
    delete user.password;
    res.status(201).json(user);
  } catch (e) {
    res.status(500).send(e);
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
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ error: "Access denied" });
      return;
    }

    const decoded = jwt.verify(token, "your-secret") as TokenPayload;

    const userRole = decoded.role;

    if (userRole !== ("ADMIN" as RoleType)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const searchPhrase = ((req.query.search as string) || "").trim();
    const isSearchNumeric = !isNaN(Number(searchPhrase));
    const filterRole = req.query.role as RoleType;

    const query = db
      .select()
      .from(usersTable)
      .where(
        and(
          filterRole ? eq(usersTable.role, filterRole) : undefined,

          searchPhrase
            ? isSearchNumeric
              ? eq(usersTable.id, Number(searchPhrase))
              : or(
                  ilike(usersTable.name, `%${searchPhrase}%`),
                  ilike(usersTable.email, `%${searchPhrase}%`),
                  ilike(usersTable.address, `%${searchPhrase}%`),
                  ilike(usersTable.phone, `$${searchPhrase}%`)
                )
            : undefined
        )
      );

    const users = await query.limit(limit).offset(offset);
    const totalUsers = await db.$count(usersTable);
    const totalPages = Math.ceil(totalUsers / limit);

    const usersWoPass = users.map(
      ({ id, email, phone, name, role, address, created_at }) => {
        return {
          id,
          email,
          phone,
          name,
          role,
          address,
          created_at,
        };
      }
    );

    res.status(200).json({
      users: usersWoPass,
      total: totalUsers,
      page,
      totalPages,
      limit,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).send(error);
  }
}
