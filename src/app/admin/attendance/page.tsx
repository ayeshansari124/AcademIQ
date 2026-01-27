"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminAttendancePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const isToday = date === today;

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const [records, setRecords] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* LOAD CLASSES + ALL STUDENTS (ONCE) */
  useEffect(() => {
    fetch("/api/admin/classes", { credentials: "include" })
      .then(r => r.json())
      .then(d => setClasses(d.classes || []));

    fetch("/api/admin/students", { credentials: "include" })
      .then(r => r.json())
      .then(d => setAllStudents(d.students || []));
  }, []);

  /* LOAD ATTENDANCE ONLY FOR MARKING */
  useEffect(() => {
    if (!selectedClass) return;

    fetch(
      `/api/admin/attendance?classId=${selectedClass}&date=${date}`,
      { credentials: "include" }
    )
      .then(r => r.json())
      .then(d => {
        setRecords(d.attendance?.records || []);
      });
  }, [selectedClass, date]);

  function toggleStatus(studentId: string) {
    if (!isToday) return;

    setRecords(prev =>
      prev.map(r =>
        String(r.student._id || r.student) === studentId
          ? {
              ...r,
              status: r.status === "PRESENT" ? "ABSENT" : "PRESENT",
            }
          : r
      )
    );
  }

  async function saveAttendance() {
    if (!selectedClass || records.length === 0) return;

    setLoading(true);
    const t = toast.loading("Saving attendance...");

    const res = await fetch("/api/admin/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        classId: selectedClass,
        date,
        records,
      }),
    });

    toast.dismiss(t);
    setLoading(false);

    if (!res.ok) {
      toast.error("Save failed");
      return;
    }

    toast.success("Attendance saved");

    // 🔥 RESET MARKING SECTION
    setSelectedClass("");
    setRecords([]);
  }

  const visibleStudents = selectedClass
    ? allStudents.filter(s => String(s.class) === selectedClass)
    : allStudents;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-900">
        Attendance
      </h1>

      {/* CONTROLS */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* MARK ATTENDANCE (TEMPORARY SECTION) */}
      {selectedClass && records.length > 0 && (
        <div className="space-y-2">
          {records.map(r => (
            <div
              key={r.student._id || r.student}
              className="flex justify-between border rounded-lg px-4 py-2"
            >
              <span>{r.student.fullName}</span>
              <button
                onClick={() =>
                  toggleStatus(r.student._id || r.student)
                }
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

      {/* STUDENTS (ALWAYS PRESENT) */}
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
            {visibleStudents.map(s => (
              <div
                key={s._id}
                onClick={() =>
                  router.push(
                    `/admin/attendance/student/${s._id}`
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
