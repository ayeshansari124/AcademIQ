import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthPayload } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const payload = await getAuthPayload();
  if (!payload) return NextResponse.json({ user: null });

  const user = await User.findById(payload.userId).select("-passwordHash");
  return NextResponse.json({ user });
}
