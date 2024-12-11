import jwt, { JwtPayload } from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { userSchema } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasPermission = (permission: string[], role: string) => {
  return permission.includes(role);
};

interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const getRoleAndUserFromToken = (token: string) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided");
  }

  const decoded = jwt.verify(token, "your-secret") as TokenPayload;

  if (!decoded.role) {
    throw new Error("Invalid token payload: missing role");
  }

  if (!decoded.userId) {
    throw new Error("Invalid token payload: missing user");
  }

  const data = {
    role: decoded.role,
    userId: decoded.userId,
  };

  return data;
};

export const getDataFromLS = (key: string) => {
  if (typeof window === "undefined") {
    return ""; // Return a fallback value during SSR
  }

  const lsData = localStorage.getItem(key);
  if (!lsData) return "";
  try {
    const value = JSON.parse(lsData);
    return value;
  } catch (e) {
    return "";
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const removeCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getUserSchema = (isEditing: boolean) =>
  isEditing ? userSchema.omit({ password: true }) : userSchema;
