import { useEffect, useState } from "react";
import { StudentMarksResponse } from "@/types/marks";

export function useStudentMarks() {
  const [data, setData] = useState<StudentMarksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/marks")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
