"use server";
import { ALLOWED_ROLES } from "./../../../api/src/utils/constants";

import { API_URL } from "@/api/config";
import { getRoleAndUserFromToken } from "@/lib/utils";
import { IUser } from "@/types/types";
import { cookies } from "next/headers";

export async function listUsers(
  page: number,
  limit: number,
  search?: string | "",
  role?: string | ""
) {
  const token = cookies().get("auth-token")?.value;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  if (role) {
    queryParams.append("role", role);
  }

  const query = queryParams.toString();

  try {
    const response = await fetch(`${API_URL}/users?${query}`, {
      method: "GET",
      headers: {
        Authorization: token ?? "",
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUserById(userId: number) {
  const token = cookies().get("auth-token")?.value;
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: token ?? "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createUser(user: IUser) {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    throw new Error("No token provided");
  }

  const { role } = getRoleAndUserFromToken(token);
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error(`${role} is not authorized to create user.`);
  }

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (error) {
    throw error;
  }
}

export async function updateUser(user: IUser) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...user, id: Number(user.id) }),
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (error) {
    throw error;
  }
}
