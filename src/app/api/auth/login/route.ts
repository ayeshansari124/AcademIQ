import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { loginUser } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const { user, token } = await loginUser(body);

    const res = NextResponse.json({ user });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
