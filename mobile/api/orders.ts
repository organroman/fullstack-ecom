import { useAuth } from "@/store/authStore";
import { API_URL } from "./config";

export async function createOrder(items: any[]) {
  const token = useAuth.getState().token;

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      order: {},
      items,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(data);
    throw new Error("Error");
  }

  return data;
}
