import { requireAdmin } from "@/guards/requireAdmin";
import {
  createNotificationController,
  fetchNotificationsForUser,
} from "@/controllers/notification.controller";
import {
  notifyAll,
  notifyAdmins,
  notifyUser,
} from "@/services/push.service";

export async function GET() {
  const { userId } = await requireAdmin();

  const notifications = await fetchNotificationsForUser({
    userId,
    role: "ADMIN",
  });

  return Response.json({ notifications });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json();

  await createNotificationController(body);

  const { scope, role, userId, userIds, title, message } = body;
  const payload = { title, body: message };

  try {
    if (scope === "ALL") await notifyAll(payload);
    if (scope === "ROLE" && role === "ADMIN") await notifyAdmins(payload);
    if (scope === "USER" && userId) await notifyUser(userId, payload);
    if (scope === "USER" && userIds?.length) {
      await Promise.allSettled(
        userIds.map((id: string) => notifyUser(id, payload))
      );
    }
  } catch {
    // push failures must not break DB success
  }

  return Response.json({ success: true });
}
