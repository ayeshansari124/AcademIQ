"use client";

import { useEffect, useState } from "react";

export default function AttendanceTab({
  studentId,
}: {
  studentId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/admin/students/${studentId}/attendance`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <p className="text-slate-500">
        Loading attendance...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-red-500">
        Attendance data not found
      </p>
    );
  }

  const { summary, monthly } = data;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">
          Attendance Summary
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Present</p>
            <p className="font-medium">{summary.present}</p>
          </div>

          <div>
            <p className="text-slate-500">Absent</p>
            <p className="font-medium">{summary.absent}</p>
          </div>

          <div>
            <p className="text-slate-500">Total Classes</p>
            <p className="font-medium">{summary.total}</p>
          </div>

          <div>
            <p className="text-slate-500">
              Attendance %
            </p>
            <p
              className={`font-semibold ${
                summary.percentage < 75
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {summary.percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Monthly */}
      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-3">
          Monthly Breakdown
        </h3>

        <div className="space-y-2 text-sm">
          {Object.entries(monthly).map(
            ([month, stats]: any) => (
              <div
                key={month}
                className="flex justify-between"
              >
                <span>{month}</span>
                <span>
                  {stats.present}/{stats.total}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
