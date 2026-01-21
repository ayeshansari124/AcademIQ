"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SendNotificationModal from "@/components/modals/SendNotificationModal";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  scope: "ALL" | "ROLE" | "USER";
  createdAt: string;
  isRead: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notifications", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("FORBIDDEN");
        }
        return res.json();
      })
      .then((data) => {
        setNotifications(data.notifications || []);
      })
      .catch(() => {
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">
          Notifications
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center
                     rounded-full bg-blue-600 text-white
                     hover:bg-blue-700 transition"
          title="Send notification"
        >
          <FaPlus />
        </button>
      </div>

      <p className="text-slate-500 text-sm">
        Broadcast messages  and view notifications.
      </p>

      {/* LOADING */}
      {loading && (
        <p className="text-slate-500 text-sm">
          Loading notifications…
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && notifications.length === 0 && (
        <p className="text-slate-500 text-sm">
          No notifications yet.
        </p>
      )}

      {/* LIST */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="rounded-lg border p-4 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-sm text-slate-800">
                    {n.title}
                  </h2>

                  <span className="text-xs text-slate-500">
                    {n.scope === "ALL"
                      ? "Broadcast"
                      : n.scope === "ROLE"
                      ? "Admin-only"
                      : "Personal"}
                  </span>
                </div>

                <span className="text-xs text-slate-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-700 mt-2">
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <SendNotificationModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
