import { useAuth } from "@/store/authStore";
import { API_URL } from "./config";

export async function updateUser(
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string
) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name, email, phone, address }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = data?.error;
    throw new Error(error);
  }
  return data;
}

export async function changePassword(oldPassword: string, password: string) {
  const token = useAuth.getState().token;
  const user = useAuth.getState().user;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/users/${user?.id}/change-password`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ oldPassword, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = data?.error;
    throw new Error(error);
  }
  return data;
}
