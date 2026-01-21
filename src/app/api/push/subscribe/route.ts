import connectDB from "@/lib/db";
import PushSubscription from "@/models/PushSubscription";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const cookieStore= await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
  const subscription = await req.json();

  await PushSubscription.findOneAndUpdate(
    { userId: payload.userId },
    { userId: payload.userId, subscription },
    { upsert: true }
  );

  return Response.json({ success: true });
}
