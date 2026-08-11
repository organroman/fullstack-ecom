import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token && (await isValidToken(token));
  const hasStaleToken = !!token && !isAuthenticated;

  let response: NextResponse;

  // if logged in and on /login or /register -> push to /dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    response = NextResponse.redirect(new URL("/dashboard", req.url));
  } else if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    // protect /dashboard routes
    response = NextResponse.redirect(new URL("/login", req.url));
  } else {
    response = NextResponse.next();
  }

  if (hasStaleToken) {
    response.cookies.delete("auth-token");
  }

  return response;
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"], // paths to guard
};
