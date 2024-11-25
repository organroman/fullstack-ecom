import { IUser } from "@/types/types";
import { API_URL } from "./config";
import { useAuth } from "@/store/authStore";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  console.log("🚀 ~ data:", data);

  if (!res.ok) {
    throw new Error(data);
  }
  return data;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to register");
  }
  return data;
}


