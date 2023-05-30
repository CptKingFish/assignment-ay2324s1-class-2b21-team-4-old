import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { env } from "./env.mjs";

export async function middleware(request: NextRequest) {
    // check jwt validity
  let token = request.cookies.get("token")?.value;
  const authRoutes = ["/authenticate", ];

  let verified = false;
  let user_id;


  if (!token && !authRoutes.includes(request.nextUrl.pathname)) {
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
    const data = (await response.json()) as {
      verified: boolean;
      user_id: string;
    };

    if (data.user_id) user_id = data.user_id;
    if (!data.verified  && authRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    } 


    // if (!data.verified) {
    //   return NextResponse.redirect(new URL("/authenticate", request.url));
    // }
    verified = data.verified;
  }
  if (verified && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
  if (!verified && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (verified && !authRoutes.includes(request.nextUrl.pathname)) {
    if (request.nextUrl.pathname.startsWith("/scrum")) {
      const response = await fetch(`${env.BASE_URL}/api/verify_scrum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: request.nextUrl.pathname.replace("/scrum/", ""),
          user_id,
        }),
      });
      const data = (await response.json()) as { verified: boolean };
      if (!data.verified) {
        return NextResponse.redirect(new URL("/chat", request.url));
      } else {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }
  if (!verified && !authRoutes.includes(request.nextUrl.pathname)) {
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
