import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push-server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();
 const cookieStore= await  cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return Response.json({ notifications: [] }, { status: 401 });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ notifications: [] }, { status: 401 });
  }

  if (payload.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const notifications = await Notification.find({
    $or: [
      { scope: "ALL" },
      { scope: "ROLE", role: "ADMIN" },
      { scope: "USER", userId: payload.userId },
    ],
  }).sort({ createdAt: -1 });

  return Response.json({ notifications });
}

// ✅ THIS WAS MISSING
export async function POST(req: Request) {
  await connectDB();
 const cookieStore= await cookies();
  const token =  cookieStore.get("token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (payload.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, message, scope = "ALL", role, userId } = await req.json();

  if (!title || !message) {
    return Response.json(
      { error: "Title and message required" },
      { status: 400 }
    );
  }

  const notification = await Notification.create({
    type: "ADMIN_BROADCAST",
    title,
    message,
    scope,
    role: scope === "ROLE" ? role : null,
    userId: scope === "USER" ? userId : null,
  });

  if (scope === "ALL") {
  const subs = await PushSubscription.find();

  await Promise.allSettled(
    subs.map((sub) =>
      sendPush(sub.subscription, {
        title,
        body: message,
      })
    )
  );
}

if (scope === "ROLE" && role === "ADMIN") {
  const subs = await PushSubscription.find({ role: "ADMIN" });

  await Promise.allSettled(
    subs.map((sub) =>
      sendPush(sub.subscription, {
        title,
        body: message,
      })
    )
  );
}
 if (scope === "USER" && userId) {
  const sub = await PushSubscription.findOne({ userId });

  if (sub) {
    await sendPush(sub.subscription, {
      title,
      body: message,
    });
  }
}

  return Response.json({ success: true, notification });
}
