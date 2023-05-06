import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "./env.mjs";

export function middleware(request: NextRequest) {
  const authRoutes = ["/authenticate"];
  // check jwt validity
  let token = request.headers.get("Authorization");
  console.log("elliott", request.headers);
  let decoded_token;
  if (!token && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
  if (token) {
    token = token.replace("Bearer ", "");
    const decoded_token = jwt.verify(token, env.JWT_SECRET) as {
      user_id: string;
    };
    if (!decoded_token) {
      return NextResponse.redirect(new URL("/authenticate", request.url));
    }
  }
  if (decoded_token && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
  if (!decoded_token && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (decoded_token && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (!decoded_token && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
