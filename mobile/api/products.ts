import { API_URL } from "./config";

export async function listProducts(query?: string) {
  const res = await fetch(`${API_URL}/products/?${query}`);
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

  console.log(data);

  return data;
}
