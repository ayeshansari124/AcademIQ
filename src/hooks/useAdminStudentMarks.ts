import { useEffect, useState } from "react";
import { StudentMarksResponse } from "@/types/marks";

export function useAdminStudentMarks(studentId: string) {
  const [data, setData] = useState<StudentMarksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    fetch(`/api/admin/marks/student/${studentId}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [studentId]);

  return { data, loading };
}
