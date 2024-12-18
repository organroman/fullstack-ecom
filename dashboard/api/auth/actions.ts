"use server"

import { login, register } from "@/api/auth";
import { cookies } from "next/headers";

export async function handleLogin(email: string, password: string) {
  try {
    const res = await login(email, password);

    if (res.token) {
      cookies().set("auth-token", res.token);
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
        cookies().set("auth-token", res.token);
      }
    }
  } catch (error) {
    throw error;
  }
}
