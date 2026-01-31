import mongoose from "mongoose";
import Notification from "@/models/Notification";
import {
  recordGlobalNotification,
  recordRoleNotification,
  recordUserNotification,
  recordUsersNotification,
} from "@/services/notification.service";
import { CreateNotificationDTO, NotificationRole } from "@/types/notification";

export async function createNotificationController(
  data: CreateNotificationDTO
) {
  if (data.scope === "ALL") {
    return recordGlobalNotification(data);
  }

  if (data.scope === "ROLE" && data.role) {
    return recordRoleNotification(data as any);
  }

  if (data.scope === "USER" && data.userId) {
    return recordUserNotification(data as any);
  }

  if (data.scope === "USER" && data.userIds?.length) {
    return recordUsersNotification(data as any);
  }

  throw new Error("INVALID_NOTIFICATION_PAYLOAD");
}

export async function fetchNotificationsForUser({
  userId,
  role,
}: {
  userId: string;
  role: NotificationRole;
}) {
  return Notification.find({
    $or: [
      { scope: "ALL" },
      { scope: "ROLE", role },
      { scope: "USER", userId: new mongoose.Types.ObjectId(userId) },
    ],
  }).sort({ createdAt: -1 }).limit(10);
}
