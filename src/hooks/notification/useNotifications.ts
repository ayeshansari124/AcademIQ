"use client";

import { useCallback, useEffect, useState } from "react";
import { NotificationEntity } from "@/types/notification";

interface UseNotificationsResult {
  notifications: NotificationEntity[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useNotifications(apiUrl: string): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiUrl, { credentials: "include" });
    const data = await res.json();
    setNotifications(data.notifications ?? []);
    setLoading(false);
  }, [apiUrl]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, refetch: fetchNotifications };
}
