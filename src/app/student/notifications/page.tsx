"use client";

import { useNotifications } from "@/hooks/notification/useNotifications";
import NotificationPage from "@/components/pages/NotificationPage";

export default function StudentNotificationsPage() {
  const { notifications, loading } = useNotifications(
    "/api/student/notifications"
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">
        Notifications
      </h1>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="text-slate-500">
          No notifications yet.
        </p>
      ) : (
        <NotificationPage notifications={notifications} />
      )}
    </div>
  );
}
