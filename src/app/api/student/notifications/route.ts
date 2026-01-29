import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { fetchNotificationsForUser } from "@/controllers/notification.controller";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ notifications: [] });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ notifications: [] });
  }

  const notifications = await fetchNotificationsForUser({
    userId: payload.userId,
    role: payload.role,
  });

  return Response.json({ notifications });
}
