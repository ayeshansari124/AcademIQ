"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentAttendanceReport() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/attendance/student/${id}`, {
      credentials: "include",
    })
      .then(r => r.json())
      .then(setData);
  }, [id]);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        My Attendance
      </h1>

      {/* SUMMARY */}
      <div className="border rounded-lg p-4 grid grid-cols-2 gap-4">
        <p>Present: <b>{data.present}</b></p>
        <p>Absent: <b>{data.absent}</b></p>
        <p>Total: <b>{data.total}</b></p>
        <p className="text-red-600">
          %: <b>{data.percentage}%</b>
        </p>
      </div>

      {/* WARNING */}
      {data.total > 0 && data.percentage < 60 && (
        <div className="border border-red-400 bg-red-50 p-3 rounded text-red-700">
          ⚠️ Critical attendance warning. Attendance is below
          60%. Immediate action required.
        </div>
      )}

      {/* MONTHLY */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Monthly</h2>
        {data.monthly.map((m: any) => (
          <div
            key={m.month}
            className="flex justify-between border-b py-1"
          >
            <span>{m.month}</span>
            <span>
              {m.present}/{m.total}
            </span>
          </div>
        ))}
      </div>

      {/* LOGS */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">
          Attendance Log
        </h2>
        {data.logs.map((l: any) => (
          <div
            key={l.date}
            className="flex justify-between border-b py-1"
          >
            <span>{l.date}</span>
            <span
              className={
                l.status === "PRESENT"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
