import connectDB from "@/lib/db";
import { fetchNotificationsForUser } from "@/controllers/notification.controller";
import { requireStudent } from "@/guards/requireStudent";

export async function GET() {
  await connectDB();

  const { userId, role } = await requireStudent();

  const notifications = await fetchNotificationsForUser({
    userId,
    role,
  });

  return Response.json({ notifications });
}
