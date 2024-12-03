"use server";

import { API_URL } from "@/api/config";
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
