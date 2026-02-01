import { useEffect, useState } from "react";
import { AttendanceReport } from "@/types/attendance";

export function useAttendanceReport({
  studentId,
  self,
}: {
  studentId?: string;
  self?: boolean;
}) {
  const [data, setData] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = self
      ? "/api/student/attendance"
      : studentId
      ? `/api/admin/attendance/student/${studentId}`
      : null;

    if (!url) return;

    fetch(url, { credentials: "include" })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [studentId, self]);

  return { data, loading, error };
}
