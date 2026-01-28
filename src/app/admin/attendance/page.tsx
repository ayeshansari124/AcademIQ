"use client";

import { useRouter } from "next/navigation";
import { useClassAttendance } from "@/hooks/useClassAttendance";

export default function AdminAttendancePage() {
  const router = useRouter();

  const {
    date,
    setDate,
    classes,
    selectedClass,
    setSelectedClass,
    records,
    toggleStatus,
    saveAttendance,
    loading,
    visibleStudents,
  } = useClassAttendance();

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-900">
        Attendance
      </h1>

      {/* Controls */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mark Attendance */}
      {selectedClass && records.length > 0 && (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.student._id}
              className="flex justify-between border rounded-lg px-4 py-2"
            >
              <span>{r.student.fullName}</span>
              <button
                onClick={() => toggleStatus(r.student._id)}
                className={`px-3 py-1 rounded text-sm ${
                  r.status === "PRESENT"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.status}
              </button>
            </div>
          ))}

          <button
            onClick={saveAttendance}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save Attendance
          </button>
        </div>
      )}

      {/* Students (always visible) */}
      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold mb-2">
          Students
        </h2>

        {visibleStudents.length === 0 ? (
          <p className="text-sm text-slate-500">
            No students available
          </p>
        ) : (
          <div className="space-y-2">
            {visibleStudents.map((s) => (
              <div
                key={s._id}
                onClick={() =>
                  router.push(
                    `/admin/attendance/student/${s._id}`,
                  )
                }
                className="cursor-pointer border rounded-lg px-4 py-2 hover:bg-slate-50"
              >
                {s.fullName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
