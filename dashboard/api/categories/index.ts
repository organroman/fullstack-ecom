"use server";

import { API_URL } from "@/api/config";
import { cookies } from "next/headers";

export async function fetchCategories(search?: string | "") {
  const token = cookies().get("auth-token")?.value;

  const queryParams = new URLSearchParams();

  if (search) {
    queryParams.append("search", search);
  }

  const query = queryParams.toString();

  try {
    const response = await fetch(`${API_URL}/categories?${query}`, {
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
