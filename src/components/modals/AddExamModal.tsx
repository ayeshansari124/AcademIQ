"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Mode = "ADMIN" | "STUDENT";

export default function AddExamModal({
  student,
  mode,
  onClose,
  onSaved,
}: {
  student: any;
  mode: Mode;
  onClose: () => void;
  onSaved: (marks: any[]) => void;
}) {
  const [examName, setExamName] = useState("");
  const [marks, setMarks] = useState<
    Record<string, { marksObtained?: number; totalMarks?: number }>
  >({});
  const [saving, setSaving] = useState(false);

  function handleChange(
    subject: string,
    field: "marksObtained" | "totalMarks",
    value: string,
  ) {
    setMarks((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: Number(value),
      },
    }));
  }

  function validate(): boolean {
    if (!examName.trim()) {
      toast.error("Exam name is required");
      return false;
    }

    for (const subject of student.subjects) {
      const data = marks[subject];

      if (!data || data.marksObtained == null || data.totalMarks == null) {
        toast.error(`Enter marks for ${subject}`);
        return false;
      }

      if (data.marksObtained < 0 || data.totalMarks <= 0) {
        toast.error(`Marks must be positive for ${subject}`);
        return false;
      }

      if (data.marksObtained > data.totalMarks) {
        toast.error(`Obtained marks cannot exceed total for ${subject}`);
        return false;
      }
    }

    return true;
  }

  async function submit() {
    if (!validate()) return;

    setSaving(true);

    const endpoint =
      mode === "ADMIN" ? "/api/admin/marks/add" : "/api/student/marks/add";

    try {
      const savedMarks: any[] = [];

      for (const subject of student.subjects) {
        const data = marks[subject];

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student._id,
            examName,
            subject,
            marksObtained: data.marksObtained,
            totalMarks: data.totalMarks,
            uploadedBy: mode,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save marks");
        }

        const saved = await res.json();
        savedMarks.push(saved);
      }

      toast.success(
        mode === "ADMIN"
          ? "Marks added successfully"
          : "Marks submitted successfully",
      );

      await onSaved(savedMarks);
      onClose();
    } catch (err) {
      toast.error("Failed to submit marks. Try again.");
    } finally {
      setSaving(false);
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
            w-full
            max-w-4xl
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
          <div className="border-b px-6 py-5 shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {mode === "ADMIN" ? "Add Exam Marks" : "Submit Exam Marks"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Enter marks for all selected subjects.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* EXAM NAME */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Exam Name
              </label>

              <input
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Unit Test / Mid Term / Final Exam"
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

            {examName && (
              <div>
                <div className="grid grid-cols-12 gap-3 bg-slate-50 rounded-2xl px-4 py-4 text-sm font-semibold text-slate-700 mb-3">
                  <div className="col-span-4">Subject</div>
                  <div className="col-span-4">Marks Obtained</div>
                  <div className="col-span-4">Total Marks</div>
                </div>

                <div className="space-y-3">
                  {student.subjects.map((subject: string) => (
                    <div
                      key={subject}
                      className="
                        grid
                        grid-cols-12
                        gap-3
                        items-center
                        p-4
                        border
                        rounded-2xl
                        bg-white
                      "
                    >
                      <div className="col-span-4 font-semibold text-slate-800">
                        {subject}
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          placeholder="0"
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-3
                            py-2.5
                          "
                          onChange={(e) =>
                            handleChange(
                              subject,
                              "marksObtained",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          placeholder="100"
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-3
                            py-2.5
                          "
                          onChange={(e) =>
                            handleChange(subject, "totalMarks", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="
                px-5
                py-2.5
                rounded-xl
                border
                border-slate-300
                font-medium
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={saving}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-blue-900
                text-white
                font-medium
                hover:bg-blue-800
                disabled:opacity-50
              "
            >
              {saving ? "Saving..." : "Submit Marks"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
