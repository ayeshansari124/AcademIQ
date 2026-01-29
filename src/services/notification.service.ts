import Notification from "@/models/Notification";
import { Types } from "mongoose";

/* --------------------------------------------------
   Internal DB writer
-------------------------------------------------- */
async function recordNotification({
  type,
  scope,
  title,
  message,
  metadata = {},
  userId = null,
  role = null,
}: {
  type: string;
  scope: "USER" | "ROLE" | "ALL";
  title: string;
  message: string;
  metadata?: any;
  userId?: string | null;
  role?: "ADMIN" | "STUDENT" | null;
}) {
  return Notification.create({
    type,
    scope,
    userId,
    role,
    title,
    message,
    metadata,
  });
}

/* --------------------------------------------------
   PUBLIC DB API
-------------------------------------------------- */

/** Single user */
export async function recordUserNotification({
  userId,
  type,
  title,
  message,
  metadata,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  return recordNotification({
    type,
    scope: "USER",
    userId,
    title,
    message,
    metadata,
  });
}

/** Multiple selected users */
export async function recordUsersNotification({
  userIds,
  type,
  title,
  message,
  metadata,
}: {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  return Notification.insertMany(
    userIds.map((id) => ({
      type,
      scope: "USER",
      userId: new Types.ObjectId(id),
      title,
      message,
      metadata,
    }))
  );
}

/** Everyone */
export async function recordGlobalNotification({
  type = "ADMIN_BROADCAST",
  title,
  message,
  metadata,
}: {
  type?: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  return recordNotification({
    type,
    scope: "ALL",
    title,
    message,
    metadata,
  });
}

/** Role based */
export async function recordRoleNotification({
  role,
  type,
  title,
  message,
  metadata,
}: {
  role: "ADMIN" | "STUDENT";
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  return recordNotification({
    type,
    scope: "ROLE",
    role,
    title,
    message,
    metadata,
  });
}
