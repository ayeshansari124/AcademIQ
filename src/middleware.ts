import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEdgeToken } from "@/lib/auth-edge";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ─────────────────────────────────────
  // PUBLIC ROUTES
  // ─────────────────────────────────────
  if (!token) {
    // unauthenticated user
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/student")
    ) {
      return NextResponse.redirect(
        new URL(
          pathname.startsWith("/admin")
            ? "/auth/admin-login"
            : "/auth/student-login",
          req.url
        )
      );
    }

    return NextResponse.next();
  }

  // ─────────────────────────────────────
  // AUTHENTICATED USER
  // ─────────────────────────────────────
  let payload;
  try {
    payload = await verifyEdgeToken(token);
  } catch {
    // invalid token → force logout
    const res = NextResponse.redirect(
      new URL("/auth/admin-login", req.url)
    );
    res.cookies.delete("token");
    return res;
  }

  const role = payload.role;

  // 🚫 Auth pages blocked for logged-in users
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL(
        role === "ADMIN"
          ? "/admin/dashboard"
          : "/student/dashboard",
        req.url
      )
    );
  }

  // 🏠 Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(
        role === "ADMIN"
          ? "/admin/dashboard"
          : "/student/dashboard",
        req.url
      )
    );
  }

  // 🔐 Role-based route protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/student/dashboard", req.url)
    );
  }

  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/admin/:path*",
    "/student/:path*",
  ],
};
