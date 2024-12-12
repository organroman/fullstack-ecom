import { API_URL } from "../config";

export async function fetchCategories(query: string) {

  const res = await fetch(`${API_URL}/categories/?${query}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error");
  }

  return data;
}
