"use client";

import { useEffect, useState } from "react";

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/notifications", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-slate-500">
        Loading notifications…
      </p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500">
          No notifications yet.
        </p>
      ) : (
       <div className="space-y-3">
  {notifications.map((n) => (
    <div
      key={n._id}
      className="rounded-lg border p-4 bg-white"
    >
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-sm">
          {n.title}
        </h2>
        <span className="text-xs text-slate-500">
          {new Date(n.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-slate-700 mt-1">
        {n.message}
      </p>
    </div>
  ))}
</div>
      )}
    </div>
  );
}
