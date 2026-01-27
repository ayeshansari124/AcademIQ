import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export function useStudent(url: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.student;
      })
      .then(setStudent)
      .finally(() => setLoading(false));
  }, [url]);

  return { student, loading };
}
