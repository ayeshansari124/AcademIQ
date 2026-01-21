"use client";

import { useEffect } from "react";

export function useBrowserNotifications() {
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission().then(async (permission) => {
      if (permission !== "granted") return;

      const res = await fetch("/api/student/notifications", {
        credentials: "include",
      });

      const data = await res.json();

      for (const n of data.notifications) {
        if (n.isRead) continue;

        // 🔔 Show notification ONCE
        new Notification(n.title, {
          body: n.message,
          tag: n._id,
        });

        // ✅ Mark as read immediately
        await fetch("/api/student/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ notificationId: n._id }),
        });
      }
    });
  }, []);
}
