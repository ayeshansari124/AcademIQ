import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then(res => res.json())
      .then(data => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  return { students, loading };
}
