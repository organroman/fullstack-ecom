"use server";

import { API_URL } from "@/api/config";
import { ProductImage } from "@/types/types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchProducts(
  page: number,
  limit: number,
  search?: string | ""
) {
  const query = search
    ? `?page=${page}&limit=${limit}&search=${search}`
    : `?page=${page}&limit=${limit}`;

  const res = await fetch(`${API_URL}/products${query}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error");
  }

  return data;
}

export async function fetchProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error");
  }

  return data;
}

interface CreateProductParams {
  product: {
    id?: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
  };
  images: ProductImage[];
}

export async function createProduct({ product, images }: CreateProductParams) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        product,
        images,
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

export async function deleteProduct(id: number) {
  const token = cookies().get("auth-token")?.value;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
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

export async function updateProduct({ product, images }: CreateProductParams) {

  const token = cookies().get("auth-token")?.value;


  try {
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify({
        product,
        images,
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
