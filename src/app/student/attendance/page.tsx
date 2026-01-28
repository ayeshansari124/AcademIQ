"use client";

import AttendanceReportView from "@/components/attendance/AttendanceReport";
import { useAttendanceReport } from "@/hooks/useAttendanceReport";

export default function StudentAttendancePage() {
  const { data, loading, error } =
    useAttendanceReport({ self: true });

  if (loading) return <p className="p-6">Loading…</p>;
 if (error || !data) {
   return <p className="p-6 text-red-500">Failed</p>;
 }
 
 return (
   <AttendanceReportView
     data={data}
     title="Attendance Report"
   />
 );
 
}
