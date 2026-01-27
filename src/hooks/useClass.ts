import { useEffect, useState } from "react";
import { Class } from "@/types/class";

export function useClass(id: string) {
  const [cls, setCls] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/classes/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCls(data.class))
      .finally(() => setLoading(false));
  }, [id]);

  return { cls, loading };
}
