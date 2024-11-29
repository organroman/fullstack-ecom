"use server";

import { API_URL } from "@/api/config";
import { cookies } from "next/headers";

export async function listUsers() {
  const token = cookies().get("auth-token")?.value;
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: token ?? "",
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
