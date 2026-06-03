"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const CLASS_OPTIONS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

export default function CreateClassModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  function updateSubject(i: number, value: string) {
    const copy = [...subjects];
    copy[i] = value.trim();
    setSubjects(copy);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clean = subjects.filter(Boolean);

    if (!className || !clean.length) {
      toast.error("Class and subjects required");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating class...");

    try {
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Class ${className}`,
          subjects: clean,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Class created");
      onSuccess();
    } catch {
      toast.error("Failed to create class");
    } finally {
      toast.dismiss(t);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
            <h2 className="text-2xl font-bold text-slate-900">Create Class</h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Select Class</option>

                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>

              {subjects.map((sub, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    value={sub}
                    onChange={(e) => updateSubject(i, e.target.value)}
                    placeholder={`Subject ${i + 1}`}
                    className="flex-1 rounded-xl border px-4 py-3"
                  />

                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSubjects(subjects.filter((_, x) => x !== i))
                      }
                      className="h-12 w-12 flex items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSubjects([...subjects, ""])}
                className="flex items-center gap-2 text-blue-900 font-medium"
              >
                <Plus size={16} />
                Add Subject
              </button>
            </div>

            {/* STICKY FOOTER */}
            <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border px-5 py-2.5"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="rounded-xl bg-blue-900 text-white px-5 py-2.5 hover:bg-blue-800"
              >
                {loading ? "Creating..." : "Create Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
