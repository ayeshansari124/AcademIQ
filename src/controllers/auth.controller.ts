import { NextResponse } from "next/server";
import { loginUser, registerAdmin } from "@/services/auth.service";

export async function loginController(body: {
  identifier: string;
  password: string;
}) {
  const { user, token } = await loginUser(body);

  const res = NextResponse.json({ user });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

export async function registerController(body: any) {
  const { user, token } = await registerAdmin(body);

  const res = NextResponse.json({ user });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
