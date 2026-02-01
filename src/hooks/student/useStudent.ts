import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export function useStudent(url: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    fetch(url, { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setStudent(data?.student ?? null))
      .finally(() => setLoading(false));
  }, [url]);

  return { student, loading };
}
