import { useEffect, useState } from "react";
import { Class } from "@/types/class";

export function useClass(id: string) {
  const [cls, setCls] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`/api/admin/classes/${id}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCls(data?.class ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  return { cls, loading };
}
