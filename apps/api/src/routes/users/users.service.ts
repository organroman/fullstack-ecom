import jwt from "jsonwebtoken";
import { SafeUser } from "../auth/auth.types.js";
import type {
  UpdateUserInput,
  CreateUserInput,
  ListUsersParams,
  PaginatedUsersResponse,
} from "./users.types.js";
import bcryptjs from "bcryptjs";
import { usersTable } from "../../db/schema/users.js";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db/index.js";

export async function updateUser(
  id: number,
  userData: UpdateUserInput,
): Promise<SafeUser | null> {
  const [updatedUser] = await db
    .update(usersTable)
    .set(userData)
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      phone: usersTable.phone,
      name: usersTable.name,
      role: usersTable.role,
      address: usersTable.address,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
      deleted_at: usersTable.deleted_at,
    });

  return updatedUser || null;
}

export async function createUser(
  userData: CreateUserInput,
): Promise<SafeUser | null> {
  userData.password = await bcryptjs.hash(userData.password, 10);
  const [user] = await db.insert(usersTable).values(userData).returning();

  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function listUsers({
  page,
  limit,
  searchPhrase,
  filterRole,
}: ListUsersParams): Promise<PaginatedUsersResponse> {
  const offset = (page - 1) * limit;
  const isSearchNumeric = !isNaN(Number(searchPhrase));

  const whereClause = and(
    filterRole ? eq(usersTable.role, filterRole) : undefined,

    searchPhrase
      ? isSearchNumeric
        ? eq(usersTable.id, Number(searchPhrase))
        : or(
            ilike(usersTable.name, `%${searchPhrase}%`),
            ilike(usersTable.email, `%${searchPhrase}%`),
            ilike(usersTable.address, `%${searchPhrase}%`),
            ilike(usersTable.phone, `%${searchPhrase}%`),
          )
      : undefined,
  );

  const [users, totalUsers] = await Promise.all([
    db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        phone: usersTable.phone,
        name: usersTable.name,
        role: usersTable.role,
        address: usersTable.address,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      })

      .from(usersTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset),
    db.$count(usersTable, whereClause),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    total: totalUsers,
    page,
    totalPages,
    limit,
  };
}

export async function getUserById(id: number): Promise<SafeUser | null> {
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      phone: usersTable.phone,
      name: usersTable.name,
      role: usersTable.role,
      address: usersTable.address,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
      deleted_at: usersTable.deleted_at,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return user || null;
}

export async function changePassword(
  id: number,
  oldPassword: string,
  newPassword: string,
): Promise<(SafeUser & { token: string }) | null> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    return null;
  }

  const isMatch = await bcryptjs.compare(oldPassword, user.password);

  if (!isMatch) {
    return null;
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  const [updatedUser] = await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      phone: usersTable.phone,
      name: usersTable.name,
      role: usersTable.role,
      address: usersTable.address,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
      deleted_at: usersTable.deleted_at,
    });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  return updatedUser ? { ...updatedUser, token } : null;
}
