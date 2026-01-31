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
      .then(res => res.json())
      .then(data => setClasses(data.classes || []));
  }, []);

  function toggleDay(day: string) {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.parentName ||
      !form.phone ||
      !form.classId ||
      subjects.length === 0 ||
      days.length === 0 ||
      !form.monthlyFees
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating student...");

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
    toast.dismiss(t);
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to create student");
      return;
    }

    toast.success("Student created");

    onSuccess({
      student: data.student,
      credentials: data.credentials,
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add Student</h2>
            <X className="h-5 w-5 cursor-pointer" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Student Full Name
              </label>
              <input
                value={form.fullName}
                onChange={e =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Parent Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Parent Name
              </label>
              <input
                value={form.parentName}
                onChange={e =>
                  setForm({ ...form, parentName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                value={form.phone}
                onChange={e =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Class
              </label>
              <select
                value={form.classId}
                onChange={e => {
                  const cls = classes.find(
                    c => c._id === e.target.value
                  );
                  setSelectedClass(cls);
                  setSubjects([]);
                  setForm({ ...form, classId: e.target.value });
                }}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subjects */}
            {selectedClass && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedClass.subjects.map((sub: string) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setSubjects(prev =>
                          prev.includes(sub)
                            ? prev.filter(s => s !== sub)
                            : [...prev, sub]
                        )
                      }
                      className={`rounded-md border px-3 py-1 text-sm ${
                        subjects.includes(sub)
                          ? "bg-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Days */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Days Attending
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-md border px-3 py-1 text-sm ${
                      days.includes(day)
                        ? "bg-blue-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Fees */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Monthly Fees (₹)
              </label>
              <input
                type="number"
                value={form.monthlyFees}
                onChange={e =>
                  setForm({ ...form, monthlyFees: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
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
