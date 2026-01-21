import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import Student from "@/models/Student";
import User from "@/models/User"
import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  // 🔐 AUTH CHECK
  const cookieStore= await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return Response.json({}, { status: 401 });

  const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
  if (payload.role !== "ADMIN") {
    return Response.json({}, { status: 403 });
  }

  const { title, message } = await req.json();
  if (!title || !message) {
    return Response.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  // 👨‍🎓 GET ALL Users
  const users = await User.find();

  await Notification.create({
  userId: null,
  scope: "ALL",
  title,
  message,
});


    // 2️⃣ Push notification
    const subs = await PushSubscription.find();

for (const sub of subs) {
  await sendPush(sub.subscription, {
    title,
    body: message,
  });
}
  return Response.json({ success: true });
}
