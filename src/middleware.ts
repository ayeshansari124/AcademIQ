import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEdgeToken } from "@/lib/auth-edge";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Public routes
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  let payload;
  try {
    payload = await verifyEdgeToken(token);
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = payload.role;

  // BLOCK AUTH FOR LOGGED IN USERS
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.redirect(
      new URL(
        role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard",
        req.url,
      ),
    );
  }

  // Role protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/student/dashboard", req.url));
  }

  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/student/:path*"],
};
