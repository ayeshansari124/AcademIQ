"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminAttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const isToday = date === today;

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAttendance, setHasAttendance] = useState(false);

  /* ---------------- HELPERS ---------------- */

  function isSunday(dateStr: string) {
    return new Date(dateStr).getDay() === 0;
  }

  function getDayName(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  function getStudentId(value: any) {
    return typeof value === "string" ? value : value._id;
  }

  /* ---------------- LOAD CLASSES ---------------- */

  useEffect(() => {
    fetch("/api/admin/classes", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  }, []);

  /* ---------------- LOAD STUDENTS + ATTENDANCE ---------------- */

  useEffect(() => {
    if (!selectedClass) return;

    setStudents(selectedClass.students || []);
    setRecords([]);
    setHasAttendance(false);

    fetch(
      `/api/admin/attendance?classId=${selectedClass._id}&date=${date}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.attendance) {
          setRecords(data.attendance.records);
          setHasAttendance(true);
        } else if (isToday) {
          // Only auto-create records for TODAY
          setRecords(
            selectedClass.students.map((s: any) => ({
              student: s._id,
              status: "PRESENT",
            }))
          );
        }
      });
  }, [selectedClass, date, isToday]);

  /* ---------------- TOGGLE ---------------- */

  function toggleStatus(studentId: string) {
    if (!isToday) return;

    setRecords((prev) =>
      prev.map((r) =>
        getStudentId(r.student) === studentId
          ? {
              ...r,
              status: r.status === "PRESENT" ? "ABSENT" : "PRESENT",
            }
          : r
      )
    );
  }

  /* ---------------- SAVE ---------------- */

  async function saveAttendance() {
    if (!selectedClass || !isToday || records.length === 0) return;

    setLoading(true);
    const t = toast.loading("Saving attendance...");

    const res = await fetch("/api/admin/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        classId: selectedClass._id,
        date,
        records,
      }),
    });

    toast.dismiss(t);
    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to save attendance");
      return;
    }

    toast.success("Attendance saved");
    setHasAttendance(true);
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-900">
        Attendance
      </h1>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={selectedClass?._id || ""}
          onChange={(e) =>
            setSelectedClass(
              classes.find((c) => c._id === e.target.value)
            )
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mode indicator */}
      {selectedClass && (
        <p className={`text-sm ${isToday ? "text-green-600" : "text-slate-500"}`}>
          {isToday
            ? "Marking today’s attendance"
            : "Viewing past attendance (read-only)"}
        </p>
      )}

      {/* Sunday warning */}
      {isSunday(date) && (
        <p className="text-red-500 text-sm">
          Attendance cannot be marked on Sundays
        </p>
      )}

      {/* Student List */}
      {!isSunday(date) && selectedClass && (
        <div className="space-y-2">
          {students
            .filter((s) =>
              s.days?.includes(getDayName(date))
            )
            .map((s) => {
              const record = records.find(
                (r) => getStudentId(r.student) === s._id
              );

              if (!record && !isToday) return null;

              const status = record?.status || "PRESENT";

              return (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-lg border px-4 py-2"
                >
                  <span>{s.fullName}</span>

                  <button
                    disabled={!isToday}
                    onClick={() => toggleStatus(s._id)}
                    className={`rounded-md px-3 py-1 text-sm ${
                      status === "PRESENT"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    } ${!isToday ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {status}
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* No past attendance */}
      {!isToday && selectedClass && !hasAttendance && (
        <p className="text-sm text-slate-500">
          No attendance was recorded for this date.
        </p>
      )}

      {/* Save */}
      {isToday && !isSunday(date) && selectedClass && (
        <button
          onClick={saveAttendance}
          disabled={loading || records.length === 0}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Save Attendance
        </button>
      )}
    </div>
  );
}
