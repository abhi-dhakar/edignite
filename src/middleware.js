import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// protected routes → need any signed-in user
const protectedRoutes = [
  "/dashboard",
  "/api/donation",
  "/api/sponsorship",
  // "/api/volunteer",
  "/api/user",
  "/api/events/register", 
];

//api/upload/upload-profile-image is public api

// admin-only routes
const adminRoutes = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/users/create",
  "/admin/volunteers",
  "/admin/volunteers/create",
  "/admin/donations",
  "/admin/donations/create",
  "/admin/sponsorships",
  "/admin/sponsorships/create",
  "/admin/events",
  "/admin/events/create",
  "/admin/media",
  "/admin/media/create",
  "/admin/messages",
  "/admin/stories",
  "/admin/stories/create",
];

// public GET, admin for other methods
const mixedAccessRoutes = {
  "/api/media": ["GET"],
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname === "/api/events/register") {
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  //  Handle mixed access routes
  for (const [route, allowedMethods] of Object.entries(mixedAccessRoutes)) {
    if (pathname.startsWith(route)) {
      if (allowedMethods.includes(method)) {
        return NextResponse.next();
      }
      if (!token || token.memberType !== "Admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }
  }

  //  If protected route, require login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // If admin route, require admin access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/admin/:path*"],
};
