import { useAuth } from "@/store/authStore";
import { API_URL } from "./config";

export async function createOrder(items: any[]) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error("Unauthorized");
  }

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

export async function getUserOrders(userId: number) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/orders/user/${userId}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error");
  }

  return data;
}

export async function getUserOrder(userId: number, orderId: number) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error("Unathorized");
  }

  const res = await fetch(`${API_URL}/orders/${orderId}/user/${userId}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Error");
  }

  return data;
}
