import { useEffect, useState } from "react";
import { StudentMarksResponse } from "@/types/marks";

export function useAdminStudentMarks(studentId: string) {
  const [data, setData] = useState<StudentMarksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/marks/student/${studentId}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    if (studentId) load();
  }, [studentId]);

  return { data, loading, reload: load };
}
