import { useEffect, useState } from "react";
import { Class } from "@/types/class";

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/classes", {
      credentials: "include",
    });
    const data = await res.json();
    setClasses(data.classes || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { classes, loading, reload: load };
}
