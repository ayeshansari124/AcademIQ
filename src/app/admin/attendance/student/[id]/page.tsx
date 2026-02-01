"use client";

import { useParams } from "next/navigation";
import AttendancePage from "@/components/pages/AttendancePage";
import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";

export default function AdminStudentAttendancePage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { data, loading, error } =
    useAttendanceReport({ studentId: id });

  if (loading) return <p className="p-6">Loading…</p>;
  if (error || !data)
    return <p className="p-6 text-red-500">Failed to load attendance</p>;

  return (
    <AttendancePage
      data={data}
      title="Attendance Report"
    />
  );
}
