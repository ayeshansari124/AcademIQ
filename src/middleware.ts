import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import FeeRecord from "@/models/FeeRecord";
import connectDB from "@/lib/db";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 🚫 Logged-in users should NOT see auth pages
  if (pathname.startsWith("/auth") && token) {
    try {
      const payload = verifyToken(token);

      if (payload.role === "ADMIN") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.url)
        );
      }

      if (payload.role === "STUDENT") {
        return NextResponse.redirect(
          new URL("/student/dashboard", req.url)
        );
      }
    } catch {}
  }

  // 🔐 Protect admin & student routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          pathname.startsWith("/admin")
            ? "/auth/admin-login"
            : "/auth/student-login",
          req.url
        )
      );
    }

    try {
      const payload = verifyToken(token);

      if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/auth/admin-login", req.url)
        );
      }

      if (pathname.startsWith("/student") && payload.role !== "STUDENT") {
        return NextResponse.redirect(
          new URL("/auth/student-login", req.url)
        );
      }
    } catch {
      //WORKS WITH COMMENTED DOES NOT WORK WHEN UNCOMMENTED
      // const res = NextResponse.redirect(new URL("/", req.url));
      // res.cookies.delete("token");
      // return res;
    }
  }

  // 🏠 Optional: redirect logged-in users from homepage
  if (pathname === "/" && token) {
    try {
      const payload = verifyToken(token);

      return NextResponse.redirect(
        new URL(
          payload.role === "ADMIN"
            ? "/admin/dashboard"
            : "/student/dashboard",
          req.url
        )
      );
    } catch {}
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
