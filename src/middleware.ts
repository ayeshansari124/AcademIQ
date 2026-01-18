import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (!token) {
    if (path.startsWith("/admin"))
      return NextResponse.redirect(new URL("/auth/admin-login", req.url));
    if (path.startsWith("/student"))
      return NextResponse.redirect(new URL("/auth/student-login", req.url));
    return NextResponse.next();
  }

  try {
    const payload = verifyToken(token);

    if (path.startsWith("/admin") && payload.role !== "ADMIN")
      return NextResponse.redirect(new URL("/auth/admin-login", req.url));

    if (path.startsWith("/student") && payload.role !== "STUDENT")
      return NextResponse.redirect(new URL("/auth/student-login", req.url));

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(
      new URL("/auth/admin-login", req.url)
    );
    // res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
