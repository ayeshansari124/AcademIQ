import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AttendanceStatus } from "@/types/attendance";

export function useClassAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((r) => r.json())
      .then((d) => setClasses(d.classes));

    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((d) => setAllStudents(d.students));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    fetch(
      `/api/admin/attendance?classId=${selectedClass}&date=${date}`,
    )
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []));
  }, [selectedClass, date]);

  function toggleStatus(studentId: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.student._id === studentId
          ? {
              ...r,
              status:
                r.status === "PRESENT"
                  ? "ABSENT"
                  : "PRESENT",
            }
          : r,
      ),
    );
  }

  async function saveAttendance() {
    setLoading(true);
    const t = toast.loading("Saving attendance...");

    const res = await fetch("/api/admin/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    setSelectedClass("");
    setRecords([]);
  }

  const visibleStudents = selectedClass
    ? allStudents.filter(
        (s) => String(s.class) === selectedClass,
      )
    : allStudents;

  return {
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
  };
}
