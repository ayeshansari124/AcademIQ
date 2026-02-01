import { useEffect, useState } from "react";
import { StudentMarksResponse } from "@/types/marks";

export function useStudentMarks() {
  const [data, setData] = useState<StudentMarksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/student/marks");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, reload: load };
}
