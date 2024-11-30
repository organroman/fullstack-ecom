"use server";

import { API_URL } from "@/api/config";

import { cookies } from "next/headers";
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

export async function handleDeleteProduct(id: number) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (error) {
    throw error;
  }
}

export async function handleUpdateProduct(
  id: number,
  name: string,
  description: string,
  image: string,
  price: string
) {
  const token = cookies().get("auth-token")?.value;
  const priceNumber = parseFloat(price);

  console.log("id:", id, "name:", name);

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        description,
        price: priceNumber,
        image,
      }),
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
