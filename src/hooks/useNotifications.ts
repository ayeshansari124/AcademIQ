import { useEffect, useState } from "react";

export function useNotifications(apiUrl: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  return { notifications, loading };
}
