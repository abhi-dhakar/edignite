import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/api/notifications",
  "/api/sponsorship",
  "/api/user",
  "/api/events/register",
  "/api/user-volunteer/",
];

const adminRoutes = [
  "/admin",
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
  "/admin/notifications",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Special case: Event registration (requires login)
  if (pathname === "/api/events/register") {
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Handle protected routes (any authenticated user)
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Handle admin-only routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*", "/admin/:path*"],
};
