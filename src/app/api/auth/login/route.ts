import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { loginUser } from "@/services/auth.service";
import {subscribeToPush }from "@/lib/push-client"

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const { user, token } = await loginUser(body);

  const res = NextResponse.json({ user });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  subscribeToPush();
  return res;
}

