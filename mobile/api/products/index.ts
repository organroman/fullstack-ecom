import { API_URL } from "../config";

export async function listProducts(
  page: number,
  limit: number,
  search?: string,
  categoryId?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }
  const query = `?${params.toString()}`;

  const res = await fetch(`${API_URL}/products/${query}`);
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
