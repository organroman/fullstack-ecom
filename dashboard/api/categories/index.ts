"use server";

import { API_URL } from "@/api/config";
import { CategoryFormModalData } from "@/types/types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
export async function createCategory(data: CategoryFormModalData) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
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

export async function updateCategory(data: CategoryFormModalData) {
  const token = cookies().get("auth-token")?.value;
  try {
    const res = await fetch(`${API_URL}/categories/${data.slug}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        display_order: parseInt(data.display_order),
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

export async function deleteCategory(id: string) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
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
