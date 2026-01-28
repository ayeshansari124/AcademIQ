// app/api/push/subscribe/route.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { saveSubscription } from "@/services/push.service";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscription } = await req.json();
  if (!subscription) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as { userId: string };

  await saveSubscription(payload.userId, subscription);

  return Response.json({ success: true });
}
