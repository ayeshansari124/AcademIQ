import { NextResponse } from "next/server";
import { unregisterPush } from "@/lib/push-client";

export async function POST() {
  const res = NextResponse.json({ success: true });

  await unregisterPush();
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
