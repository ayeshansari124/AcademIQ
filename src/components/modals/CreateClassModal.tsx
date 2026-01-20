"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const CLASS_OPTIONS = [
  "I", "II", "III", "IV", "V",
  "VI", "VII", "VIII", "IX", "X",
];

function capitalize(word: string) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

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

  function updateSubject(index: number, value: string) {
    const copy = [...subjects];
    copy[index] = capitalize(value.trim());
    setSubjects(copy);
  }

  function addSubject() {
    setSubjects([...subjects, ""]);
  }

  function removeSubject(index: number) {
    setSubjects(subjects.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanSubjects = subjects.filter(Boolean);

    if (!className || cleanSubjects.length === 0) {
      toast.error("Class and subjects required");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating class...");

    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: `Class ${className}`,
        subjects: cleanSubjects,
      }),
    });

    toast.dismiss(t);
    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to create class");
      return;
    }

    toast.success("Class created");
    onSuccess();
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create Class</h2>
            <X className="cursor-pointer" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Class Dropdown */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Class
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">Select Class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subjects */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Subjects
              </label>

              <div className="space-y-2">
                {subjects.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={sub}
                      onChange={(e) =>
                        updateSubject(i, e.target.value)
                      }
                      placeholder="Subject name"
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    />

                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(i)}
                        className="rounded-md border p-2 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSubject}
                className="mt-3 flex items-center gap-1 text-sm text-blue-600"
              >
                <Plus size={16} /> Add Subject
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
