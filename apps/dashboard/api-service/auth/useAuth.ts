import { login, register } from "@/api-service/auth";
import Cookies from "js-cookie";

const authCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function handleLogin(email: string, password: string) {
  try {
    const res = await login(email, password);

    if (res.token) {
      Cookies.set("auth-token", res.token, authCookieOptions);
    }
  } catch (error) {
    throw error;
  }
}
//TODO: REDIRECT AND AUTOLOGIN
export async function handleSignUp(
  email: string,
  password: string,
  name: string,
  address: string
) {
  try {
    const res = await register(email, password, name, address);

    if (res) {
      const loginRes = await login(email, password);
      if (loginRes.token) {
        Cookies.set("auth-token", loginRes.token, authCookieOptions);
      }
    }
  } catch (error) {
    throw error;
  }
}
