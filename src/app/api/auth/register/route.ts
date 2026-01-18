import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { registerAdmin } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
