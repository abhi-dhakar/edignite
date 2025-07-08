import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// protected routes
const protectedRoutes = [
  "/dashboard",
  "/api/donation",
  "/api/sponsorship",
  "/api/volunteer",
  "/api/event",
  "/api/user",
];

//admin-only routes
const adminRoutes = [
  "/api/volunteer",
  "/api/event",
  "/api/story",
  "/api/media",
  "/api/message",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  //If route is protected and user not logged in → redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If route is admin-only and user is not admin → deny access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
