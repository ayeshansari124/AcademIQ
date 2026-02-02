"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { StudentCreationResult } from "@/types/student";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddStudentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (result: StudentCreationResult) => void;
}) {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    parentName: "",
    phone: "",
    classId: "",
    monthlyFees: "",
  });

  useEffect(() => {
    fetch("/api/admin/classes", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  }, []);

  function toggleItem(
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.parentName ||
      !form.phone ||
      !form.classId ||
      !subjects.length ||
      !days.length ||
      !form.monthlyFees
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating student...");

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          parentName: form.parentName,
          phone: form.phone,
          classId: form.classId,
          subjects,
          days,
          monthlyFee: Number(form.monthlyFees),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Student created");
      onSuccess({
        student: data.student,
        credentials: data.credentials,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create student");
    } finally {
      toast.dismiss(t);
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Modal wrapper */}
      <div className="fixed inset-0 z-50 flex justify-center px-4 py-6">
        <div
          className="
            w-full max-w-lg
            max-h-[95vh]
            overflow-y-auto
            bg-white rounded-xl shadow-xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">Add Student</h2>
            <X
              className="h-6 w-6 cursor-pointer text-slate-600"
              onClick={onClose}
            />
          </header>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
            {[
              ["Student Full Name", "fullName"],
              ["Parent Name", "parentName"],
              ["Phone Number", "phone"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-base"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={form.classId}
                onChange={(e) => {
                  const cls = classes.find((c) => c._id === e.target.value);
                  setSelectedClass(cls);
                  setSubjects([]);
                  setForm({ ...form, classId: e.target.value });
                }}
                className="w-full rounded-lg border px-3 py-2 text-base"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClass && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedClass.subjects.map((sub: string) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleItem(sub, subjects, setSubjects)}
                      className={`rounded-lg px-4 py-2 text-sm border ${
                        subjects.includes(sub)
                          ? "bg-blue-900 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Days Attending
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleItem(day, days, setDays)}
                    className={`rounded-lg px-4 py-2 text-sm border ${
                      days.includes(day)
                        ? "bg-blue-900 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Fees (₹)
              </label>
              <input
                type="number"
                value={form.monthlyFees}
                onChange={(e) =>
                  setForm({ ...form, monthlyFees: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-base"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-900 px-4 py-2 text-white disabled:opacity-60"
              >
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
