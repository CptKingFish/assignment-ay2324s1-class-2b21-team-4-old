import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { env } from "./env.mjs";

export async function middleware(request: NextRequest) {
  console.log("middleware", request.nextUrl.pathname);
  const authRoutes = ["/authenticate"];
  let verified = false;
  // check jwt validity
  let token = request.cookies.get("token")?.value;
  if (!token && !authRoutes.includes(request.nextUrl.pathname)) {
    console.log("no token :(");
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
  if (token) {
    token = token.replace("Bearer ", "");
    const response = await fetch(`${env.BASE_URL}/api/verify_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = (await response.json()) as { verified: boolean };
    console.log(request.nextUrl.pathname, data);
    if (!data.verified && authRoutes.includes(request.nextUrl.pathname)) {
      console.log("ee4");
      return NextResponse.next();
    }
    // if (!data.verified) {
    //   return NextResponse.redirect(new URL("/authenticate", request.url));
    // }
    verified = data.verified;
  }
  if (verified && authRoutes.includes(request.nextUrl.pathname)) {
    console.log("eeredirecting to /chat");
    return NextResponse.redirect(new URL("/chat", request.url));
  }
  if (!verified && authRoutes.includes(request.nextUrl.pathname)) {
    console.log("ee1");
    return NextResponse.next();
  }
  if (verified && !authRoutes.includes(request.nextUrl.pathname)) {
    console.log("ee2");
    return NextResponse.next();
  }
  if (!verified && !authRoutes.includes(request.nextUrl.pathname)) {
    console.log("ee3");
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
