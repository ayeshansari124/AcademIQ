"use client";

import AttendancePage from "@/components/pages/AttendancePage";
import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";

export default function StudentAttendancePage() {
  const { data, loading, error } =
    useAttendanceReport({ self: true });

  if (loading) return <p className="p-6">Loading…</p>;
  if (error || !data)
    return <p className="p-6 text-red-500">Failed to load attendance</p>;

  return (
    <AttendancePage
      data={data}
      title="My Attendance"
    />
  );
}
