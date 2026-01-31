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
      : `/api/admin/attendance/student/${studentId}`;

    fetch(url, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [studentId, self]);

  return { data, loading, error };
}
