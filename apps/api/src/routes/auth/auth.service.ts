import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import type { RegisterUserInput, SafeUser } from "./auth.types.js";

import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema/users.js";

export async function signUp(
  userInput: RegisterUserInput,
): Promise<SafeUser | null> {
  userInput.password = await bcryptjs.hash(userInput.password, 10);

  const [user] = await db.insert(usersTable).values(userInput).returning();

  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;

  return safeUser;
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: SafeUser } | null> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    return null;
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    return null;
  }

  //create jwt token

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  const { password: _password, ...safeUser } = user;

  return { token, user: safeUser };
}
