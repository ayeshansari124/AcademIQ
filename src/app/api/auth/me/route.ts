import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).select("-passwordHash");
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
