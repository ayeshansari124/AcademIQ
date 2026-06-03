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
    fetch("/api/admin/classes", {
      credentials: "include",
    })
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
        headers: {
          "Content-Type": "application/json",
        },
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

      if (!res.ok) {
        throw new Error(data.error);
      }

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
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-2xl
            bg-white
            rounded-3xl
            shadow-2xl
            max-h-[90vh]
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-5 border-b shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Add Student</h2>

              <p className="text-sm text-slate-500 mt-1">
                Create a new student account and assign subjects.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </header>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* STUDENT NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student Full Name
                </label>

                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="Ayesha Ansari"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-200
                  "
                />
              </div>

              {/* PARENT */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Parent Name
                </label>

                <input
                  value={form.parentName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      parentName: e.target.value,
                    })
                  }
                  placeholder="Mohammed Ansari"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-200
                  "
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+91 9876543210"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-200
                  "
                />
              </div>

              {/* CLASS */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class
                </label>

                <select
                  value={form.classId}
                  onChange={(e) => {
                    const cls = classes.find((c) => c._id === e.target.value);

                    setSelectedClass(cls);
                    setSubjects([]);

                    setForm({
                      ...form,
                      classId: e.target.value,
                    });
                  }}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                  "
                >
                  <option value="">Select Class</option>

                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBJECTS */}
              {selectedClass && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Subjects
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {selectedClass.subjects.map((sub: string) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleItem(sub, subjects, setSubjects)}
                        className={`
                          rounded-xl
                          px-4
                          py-2
                          text-sm
                          border
                          transition
                          ${
                            subjects.includes(sub)
                              ? "bg-blue-900 text-white border-blue-900"
                              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DAYS */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Days Attending
                </label>

                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleItem(day, days, setDays)}
                      className={`
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        border
                        transition
                        ${
                          days.includes(day)
                            ? "bg-blue-900 text-white border-blue-900"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* FEES */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Fees (₹)
                </label>

                <input
                  type="number"
                  value={form.monthlyFees}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      monthlyFees: e.target.value,
                    })
                  }
                  placeholder="3000"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-200
                  "
                />
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  py-2.5
                  font-medium
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  rounded-xl
                  bg-blue-900
                  px-5
                  py-2.5
                  text-white
                  font-medium
                  hover:bg-blue-800
                  disabled:opacity-60
                "
              >
                {loading ? "Creating..." : "Create Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
