import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  createNotificationController,
  fetchNotificationsForUser,
} from "@/controllers/notification.controller";
import {
  notifyUser,
  notifyUsers,
  notifyAll,
  notifyAdmins,
} from "@/services/push.service";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getAdmin() {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const payload = jwt.verify(token, JWT_SECRET) as any;
  if (payload.role !== "ADMIN") throw new Error("FORBIDDEN");

  return payload;
}

export async function GET() {
  await connectDB();
  const admin = await getAdmin();

  const notifications = await fetchNotificationsForUser({
    userId: admin.userId,
    role: "ADMIN",
  });

  return Response.json({ notifications });
}

export async function POST(req: Request) {
  await connectDB();
  await getAdmin();

  const body = await req.json();
  await createNotificationController(body);

 // 2️⃣ PUSH delivery (SIDE EFFECT)
  const { scope, role, userId, userIds, title, message } = body;

  const payload = {
    title,
    body: message,
  };

try {
  if (scope === "ALL") {
    await notifyAll(payload);
  }

  if (scope === "ROLE" && role === "ADMIN") {
    await notifyAdmins(payload);
  }

  if (scope === "USER" && userId) {
    await notifyUser(userId, payload);
  }

  if (scope === "USER" && userIds?.length) {
    await Promise.allSettled(
      userIds.map((id: string) =>
        notifyUser(id, payload)
      )
    );
  }
} catch (err) {
  console.error("Push notification failed:", err);
  // DO NOT throw
}
  return Response.json({ success: true });
}
