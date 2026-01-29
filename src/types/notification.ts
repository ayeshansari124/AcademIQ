export type NotificationScope = "ALL" | "ROLE" | "USER";

export interface CreateNotificationDTO {
  type: string;
  title: string;
  message: string;
  scope: NotificationScope;
  role?: "ADMIN" | "STUDENT";
  userId?: string;
  userIds?: string[];
  metadata?: Record<string, any>;
}
