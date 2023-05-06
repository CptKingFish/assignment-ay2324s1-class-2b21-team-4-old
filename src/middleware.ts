import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { env } from "./env.mjs";
import { type IUser } from "./models/User.js";

export async function middleware(request: NextRequest) {
  const authRoutes = ["/authenticate"];
  // check jwt validity
  let token = request.cookies.get("token")?.value;
  let user: undefined | IUser;
  if (!token && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
  if (token) {
    token = token.replace("Bearer ", "");
    await fetch(`${env.BASE_URL}/api/verify_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data: IUser) => {
        user = data;
      })
      .catch((err) => {
        console.log(err);
      });

    // const decoded_token = jwt.verify(token, env.JWT_SECRET) as {
    //   user_id: string;
    // };
    if (!user) {
      return NextResponse.redirect(new URL("/authenticate", request.url));
    }
  }
  if (user && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
  if (!user && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (user && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (!user && !authRoutes.includes(request.nextUrl.pathname)) {
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
