import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AttendanceStatus } from "@/types/attendance";

export function useClassAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LOAD CLASSES + STUDENTS (SOURCE OF TRUTH) ---
  async function loadBaseData() {
    const [cRes, sRes] = await Promise.all([
      fetch("/api/admin/classes"),
      fetch("/api/admin/students"),
    ]);

    const cData = await cRes.json();
    const sData = await sRes.json();

    setClasses(cData.classes || []);
    setStudents(sData.students || []);
  }

  useEffect(() => {
    loadBaseData();
  }, []);

  // --- LOAD ATTENDANCE RECORDS ---
  async function loadAttendance() {
    if (!selectedClass) {
      setRecords([]);
      return;
    }

    const res = await fetch(
      `/api/admin/attendance?classId=${selectedClass}&date=${date}`,
    );
    const data = await res.json();
    setRecords(data.records || []);
  }

  useEffect(() => {
    loadAttendance();
  }, [selectedClass, date]);

  function toggleStatus(studentId: string) {
    setRecords(prev =>
      prev.map(r =>
        r.student._id === studentId
          ? {
              ...r,
              status:
                r.status === "PRESENT" ? "ABSENT" : "PRESENT",
            }
          : r,
      ),
    );
  }

  async function saveAttendance() {
    if (!selectedClass) {
      toast.error("Select a class");
      return;
    }

    setLoading(true);
    const t = toast.loading("Saving attendance...");

    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          date,
          records,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Attendance saved");

      // ✅ HARD RESET UI STATE
      setSelectedClass("");
      setRecords([]);

      // ✅ FORCE CLEAN REFRESH
      await loadBaseData();
    } catch {
      toast.error("Save failed");
    } finally {
      toast.dismiss(t);
      setLoading(false);
    }
  }

  return {
    date,
    setDate,
    classes,
    selectedClass,
    setSelectedClass,
    students, // ✅ ALWAYS FULL LIST
    records,
    toggleStatus,
    saveAttendance,
    loading,
  };
}
