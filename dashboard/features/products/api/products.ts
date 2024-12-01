import { API_URL } from "@/api/config";


export async function listProducts(
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

