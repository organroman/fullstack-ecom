"use server";

import { API_URL } from "@/api/config";
import { cookies } from "next/headers";

export async function fetchOrders() {
  const token = cookies().get("auth-token")?.value;
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: token ?? "",
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchOrderById(id: number) {
  const token = cookies().get("auth-token")?.value;

  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: token ?? "",
        "Content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateOrderStatus(id: number, status: string) {
  const token = cookies().get("auth-token")?.value;

  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: token ?? "",
        "Content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        status: status,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to update");
    }
    return data;
  } catch (error) {
    throw error;
  }
}