import Notification from "@/models/Notification";

const MIN_ATTENDANCE_PERCENTAGE = 75;

export default async function createUserNotification({
  userId,
  type,
  title,
  message,
  metadata = {},
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  await Notification.create({
    type,
    scope: "USER",
    userId,
    title,
    message,
    metadata,
  });
}

export async function createAdminBroadcast({
  title,
  message,
  metadata = {},
}: {
  title: string;
  message: string;
  metadata?: any;
}) {
  return Notification.create({
    type: "ADMIN_BROADCAST",
    scope: "ALL",          // 👈 visible to everyone
    userId: null,          // 👈 MUST be null
    role: null,
    title,
    message,
    metadata,
  });
}
