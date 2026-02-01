import { requireStudent } from "@/guards/requireStudent";
import { fetchNotificationsForUser } from "@/controllers/notification.controller";

export async function GET() {
  const { userId } = await requireStudent();

  const notifications = await fetchNotificationsForUser({
    userId,
    role: "STUDENT",
  });

  return Response.json({ notifications });
}
