import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ notifications: [] });
  }

  let payload;
try {
  payload = jwt.verify(token, JWT_SECRET) as any;
} catch {
  return Response.json({ notifications: [] });
}
  const { userId, role } = payload;

const notifications = await Notification.find({
  $or: [
    { scope: "ALL" },
    { scope: "ROLE", role },
    { scope: "USER", userId: new mongoose.Types.ObjectId('696f82915e63fd76502a714b') },
  ],
}).sort({ createdAt: -1 });

  return Response.json({ notifications });
}

export async function PATCH(req: Request) {
  await connectDB();

  const { notificationId } = await req.json();

  await Notification.findByIdAndUpdate(notificationId, {
    isRead: true,
  });

  return Response.json({ success: true });
}
