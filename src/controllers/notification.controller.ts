import Notification from "@/models/Notification";
import mongoose from "mongoose";
import {
  recordGlobalNotification,
  recordRoleNotification,
  recordUserNotification,
  recordUsersNotification,
} from "../services/notification.service";
import { CreateNotificationDTO } from "@/types/notification";

/* ---------------- CREATE (ADMIN) ---------------- */

export async function createNotificationController(
  data: CreateNotificationDTO
) {
  const { scope } = data;

  if (scope === "ALL") {
    return recordGlobalNotification(data);
  }

  if (scope === "ROLE" && data.role) {
    return recordRoleNotification(data);
  }

  if (scope === "USER" && data.userId) {
    return recordUserNotification(data);
  }

  if (scope === "USER" && data.userIds?.length) {
    return recordUsersNotification(data);
  }

  throw new Error("INVALID_NOTIFICATION_PAYLOAD");
}

/* ---------------- FETCH ---------------- */

export async function fetchNotificationsForUser({
  userId,
  role,
}: {
  userId: string;
  role: "ADMIN" | "STUDENT";
}) {
  return Notification.find({
    $or: [
      { scope: "ALL" },
      { scope: "ROLE", role },
      { scope: "USER", userId: new mongoose.Types.ObjectId(userId) },
    ],
  }).sort({ createdAt: -1 });
}

/* ---------------- READ ---------------- */

export async function markNotificationAsRead(notificationId: string) {
  return Notification.findByIdAndUpdate(notificationId, {
    isRead: true,
  });
}
