"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationList from "@/components/notifications/NotificationList";
import SendNotificationModal from "@/components/modals/SendNotificationModal";

export default function AdminNotificationsPage() {
  const { notifications, loading } = useNotifications(
    "/api/admin/notifications"
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
        >
          <FaPlus />
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="text-slate-500">No notifications.</p>
      ) : (
        <NotificationList notifications={notifications} />
      )}

      {open && <SendNotificationModal onClose={() => setOpen(false)} />}
    </div>
  );
}
