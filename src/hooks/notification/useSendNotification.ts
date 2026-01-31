"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CreateNotificationDTO } from "@/types/notification";

interface UseSendNotificationResult {
  send: (data: CreateNotificationDTO) => Promise<void>;
  loading: boolean;
}

export function useSendNotification(
  onSuccess: () => void
): UseSendNotificationResult {
  const [loading, setLoading] = useState(false);

  async function send(data: CreateNotificationDTO) {
    if (loading) return;

    const toastId = toast.loading("Sending notification...");

    try {
      setLoading(true);

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("SEND_NOTIFICATION_FAILED");
      }

      toast.success("Notification sent successfully!!");
      onSuccess();
    } catch {
      toast.error("Failed to send notification");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  return { send, loading };
}
