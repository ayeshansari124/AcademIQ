"use client";

import { useEffect, useState } from "react";

export default function StudentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/attendance", { credentials: "include" })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-500">Loading attendance…</p>;
  }

  if (!data || data.error) {
    return <p className="p-6 text-red-500">Failed to load attendance</p>;
  }

  const { summary, monthly, daily } = data;

  function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        My Attendance
      </h1>

      {/* Summary */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Present: <b>{summary.present}</b></div>
          <div>Absent: <b>{summary.absent}</b></div>
          <div>Total: <b>{summary.total}</b></div>
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
              {summary.percentage < 75 && (
  <div
    className={`rounded-lg border p-3 text-sm ${
      summary.percentage < 60
        ? "border-red-500 bg-red-50 text-red-700"
        : "border-yellow-500 bg-yellow-50 text-yellow-700"
    }`}
  >
    {summary.percentage < 60 ? (
      <p>
        ⚠️ <b>Critical attendance warning.</b><br />
        Attendance is below 60%. Immediate action required.
      </p>
    ) : (
      <p>
        ⚠️ <b>Low attendance alert.</b><br />
        Attendance is below the required 75%. Immediate Actions Required.
      </p>
    )}
  </div>
)}

      {/* Monthly */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Monthly</h2>
        {Object.keys(monthly).length === 0 ? (
          <p className="text-sm text-slate-500">No data</p>
        ) : (
          <div className="space-y-2 text-sm">
            {Object.entries(monthly).map(
              ([month, m]: any) => (
                <div key={month} className="flex justify-between">
                  <span>{month}</span>
                  <span>
                    {m.present}/{m.total}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Daily Log */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Attendance Log</h2>

        {daily.length === 0 ? (
          <p className="text-sm text-slate-500">No records</p>
        ) : (
          <div className="space-y-2 text-sm">
            {daily.map((d: any) => (
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
