"use client";

import { useClassAttendance } from "@/hooks/attendance/useClassAttendance";
import ListCard from "@/components/common/ListCard";
import { useRouter } from "next/navigation";

export default function AdminAttendancePage() {
  const {
    date,
    setDate,
    classes,
    selectedClass,
    setSelectedClass,
    students,
    records,
    toggleStatus,
    saveAttendance,
    loading,
  } = useClassAttendance();
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-blue-900">
          Attendance Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Mark and review student attendance
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-4">
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

      {/* MARK ATTENDANCE */}
      {selectedClass && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-blue-900">
            Mark Attendance
          </h2>

          {records.length === 0 ? (
            <p className="text-sm text-slate-500">No attendance marked yet.</p>
          ) : (
            records.map((r) => (
              <div
                key={r.student._id}
                className="flex items-center justify-between rounded-lg border px-4 py-2"
              >
                <span className="font-medium">{r.student.fullName}</span>

                <button
                  onClick={() => toggleStatus(r.student._id)}
                  className={`cursor-pointer px-3 py-1 rounded text-sm ${
                    r.status === "PRESENT"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.status}
                </button>
              </div>
            ))
          )}

          <button
            onClick={saveAttendance}
            disabled={loading}
            className="cursor-pointer rounded bg-blue-900 px-5 py-2 text-white disabled:opacity-60"
          >
            Save Attendance
          </button>
        </div>
      )}

      {/* STUDENTS LIST */}
      <div className="pt-6 border-t space-y-2">
        <h2 className="text-lg font-semibold text-blue-900">View Attendance</h2>
        <p className="text-sm text-slate-500">
          Select a student to view detailed attendance
        </p>

        <div className="space-y-3">
          {students.length === 0 ? (
            <p className="text-sm text-slate-500">No students found</p>
          ) : (
            students.map((s) => (
              <ListCard
                key={s._id}
                title={s.fullName}
                onClick={() =>
                  router.push(`/admin/attendance/student/${s._id}`)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
