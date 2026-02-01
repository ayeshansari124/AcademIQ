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
    value: string
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
      mode === "ADMIN"
        ? "/api/admin/marks/add"
        : "/api/student/marks/add";

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
            uploadedBy: mode, // 🔥 CORE FIX
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
          : "Marks submitted successfully"
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-5">
          {mode === "ADMIN" ? "Add Exam Marks" : "Submit Exam Marks"}
        </h3>

        <div className="mb-6 max-w-sm">
          <label className="block text-sm font-medium mb-1">
            Exam Name
          </label>
          <input
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full border px-3 py-2 text-sm"
            placeholder="Unit Test / Mid Term / Final"
          />
        </div>

        {examName && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-600 mb-2">
              <div className="col-span-4">Subject</div>
              <div className="col-span-4">Obtained</div>
              <div className="col-span-4">Total</div>
            </div>

            {student.subjects.map((subject: string) => (
              <div
                key={subject}
                className="grid grid-cols-12 gap-2 items-center py-2 border-t text-sm"
              >
                <div className="col-span-4 font-medium">{subject}</div>

                <div className="col-span-4">
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    onChange={(e) =>
                      handleChange(subject, "marksObtained", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-4">
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    onChange={(e) =>
                      handleChange(subject, "totalMarks", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 text-sm rounded disabled:opacity-50"
          >
            {saving ? "Saving…" : "Submit Marks"}
          </button>
        </div>
      </div>
    </div>
  );
}
