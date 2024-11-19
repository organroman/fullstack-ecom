"use server";

import { login, register } from "@/api/auth";
import { API_URL } from "@/api/config";
import { Product } from "@/types/types";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function handleCreateProduct(
  name: string,
  description: string,
  image: string,
  price: string
) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        price,
        image,
      }),
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        redirect("/login");
      } else throw new Error(res.statusText);
    }
  } catch (error) {
    throw error;
  }
}
