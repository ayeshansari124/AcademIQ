"use client";

import { AttendanceReport, AttendanceStatus } from "@/types/attendance";

export default function AttendanceReportView({
  data,
  title = "My Attendance",
}: {
  data: AttendanceReport;
  title?: string;
}) {
  const {
  summary,
  monthly = {},
  daily = [],
  student,
} = data ?? {};


  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    
    <div className="p-6 max-w-3xl mx-auto space-y-6">
        
      {/* Title */}
      <h1 className="text-2xl font-semibold text-blue-900">
        {title}
      </h1>

      {/* Admin-only student name */}
      {student?.name && title !== "My Attendance" && (
        <p className="text-sm text-slate-600">
          Student:{" "}
          <span className="font-medium text-slate-900">
            {student.name}
          </span>
        </p>
      )}

      {/* SUMMARY */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Summary</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            Present: <b>{summary.present}</b>
          </div>
          <div>
            Absent: <b>{summary.absent}</b>
          </div>
          <div>
            Total: <b>{summary.total}</b>
          </div>
          <div>
            %:
            <b
              className={`ml-1 ${
                summary.percentage < 75
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {summary.percentage}%
            </b>
          </div>
        </div>
      </div>

      {/* WARNING */}
      {summary.percentage < 75 && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            summary.percentage < 60
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-yellow-500 bg-yellow-50 text-yellow-700"
          }`}
        >
          {summary.percentage < 60
            ? "⚠️ Attendance critically low (below 60%). Immediate action required."
            : "⚠️ Attendance below required 75% threshold."}
        </div>
      )}

      {/* MONTHLY */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Monthly</h2>

        {Object.keys(monthly).length === 0 ? (
          <p className="text-sm text-slate-500">
            No data
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {Object.entries(monthly).map(
              ([month, m]) => (
                <div
                  key={month}
                  className="flex justify-between"
                >
                  <span>{month}</span>
                  <span>
                    {m.present}/{m.total}
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* DAILY LOG */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">
          Attendance Log
        </h2>

        {daily.length === 0 ? (
          <p className="text-sm text-slate-500">
            No records
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {daily.map((d) => (
              <div
                key={d.date}
                className="flex justify-between"
              >
                <span>{formatDate(d.date)}</span>
                <span
                  className={
                    d.status === "PRESENT"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
