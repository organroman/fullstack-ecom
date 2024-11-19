import { API_URL } from "@/api/config";
import { Product } from "@/types/types";

export async function listProducts() {
  const res = await fetch(`${API_URL}/products`);
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

export async function createProduct(product: Product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    }),
  });
}
