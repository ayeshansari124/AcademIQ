export type NotificationScope = "ALL" | "ROLE" | "USER";
export type NotificationRole = "ADMIN" | "STUDENT";

export type NotificationType =
  | "ABSENT"
  | "LOW_ATTENDANCE"
  | "ADMIN_BROADCAST"
  | "ASSIGNMENT"
  | "FEES_DUE"
  | "FEES_URGENT"
  | "FEES_OVERDUE"
  | "FEES_PAID"
  | "MARKS_UPLOADED";

export interface CreateNotificationDTO {
  type?: NotificationType;
  title: string;
  message: string;
  scope: NotificationScope;
  role?: NotificationRole;
  userId?: string;
  userIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface NotificationEntity {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  scope: NotificationScope;
  role?: NotificationRole | null;
  userId?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
