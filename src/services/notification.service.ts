import "server-only";
import Notification from "@/models/Notification";
import { Types } from "mongoose";
import { CreateNotificationDTO } from "@/types/notification";

async function recordNotification(data: {
  type: string;
  scope: "USER" | "ROLE" | "ALL";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: Types.ObjectId | null;
  role?: "ADMIN" | "STUDENT" | null;
}) {
  return Notification.create({
    ...data,
    metadata: data.metadata ?? {},
  });
}

export async function recordUserNotification(
  data: Required<Pick<CreateNotificationDTO, "userId" | "title" | "message">> &
    Partial<CreateNotificationDTO>,
) {
  return recordNotification({
    type: data.type ?? "ADMIN_BROADCAST",
    scope: "USER",
    userId: new Types.ObjectId(data.userId),
    title: data.title,
    message: data.message,
    metadata: data.metadata,
  });
}

export async function recordUsersNotification(
  data: Required<Pick<CreateNotificationDTO, "userIds" | "title" | "message">> &
    Partial<CreateNotificationDTO>,
) {
  return Notification.insertMany(
    data.userIds.map((id) => ({
      type: data.type ?? "ADMIN_BROADCAST",
      scope: "USER",
      userId: new Types.ObjectId(id),
      title: data.title,
      message: data.message,
      metadata: data.metadata ?? {},
    })),
  );
}

export async function recordGlobalNotification(
  data: Pick<CreateNotificationDTO, "title" | "message" | "metadata" | "type">,
) {
  return recordNotification({
    type: data.type ?? "ADMIN_BROADCAST",
    scope: "ALL",
    title: data.title,
    message: data.message,
    metadata: data.metadata,
  });
}

export async function recordRoleNotification(
  data: Required<Pick<CreateNotificationDTO, "role" | "title" | "message">> &
    Partial<CreateNotificationDTO>,
) {
  return recordNotification({
    type: data.type ?? "ADMIN_BROADCAST",
    scope: "ROLE",
    role: data.role,
    title: data.title,
    message: data.message,
    metadata: data.metadata,
  });
}
