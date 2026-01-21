import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ notifications: [] });
  }

  const payload: any = jwt.verify(token, JWT_SECRET);

 const notifications = await Notification.find({
  $or: [
    { scope: "ALL" },
    { userId: payload.userId },
  ],
})
.sort({ createdAt: -1 })
.limit(50);



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
