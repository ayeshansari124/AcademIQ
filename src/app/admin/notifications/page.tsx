"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/notification/useNotifications";
import NotificationPage from "@/components/pages/NotificationPage";
import SendNotificationModal from "@/components/modals/SendNotificationModal";
import PlusFab from "@/components/common/PlusFab";

export default function AdminNotificationsPage() {
  const { notifications, loading, refetch } = useNotifications(
    "/api/admin/notifications",
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and send announcements to students
          </p>
        </div>

        <PlusFab onClick={() => setOpen(true)} label="Send notification" />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-slate-500">No notifications yet.</p>
      ) : (
        <NotificationPage notifications={notifications} />
      )}

      {/* MODAL */}
      {open && (
        <SendNotificationModal
          onClose={() => setOpen(false)}
          onSuccess={async () => {
            setOpen(false);
            await refetch();
          }}
        />
      )}
    </div>
  );
}
