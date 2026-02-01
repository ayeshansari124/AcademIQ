"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const CLASS_OPTIONS = [
  "I","II","III","IV","V","VI","VII","VIII","IX","X",
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
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <header className="mb-6 flex justify-between">
            <h2 className="text-lg font-semibold">Create Class</h2>
            <X className="cursor-pointer" onClick={onClose} />
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={className}
              onChange={e => setClassName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map(c => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>

            {subjects.map((sub, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={sub}
                  onChange={e =>
                    updateSubject(i, e.target.value)
                  }
                  className="flex-1 rounded-lg border px-3 py-2"
                />
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSubjects(subjects.filter((_, x) => x !== i))
                    }
                    className="cursor-pointer rounded-md border p-2 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setSubjects([...subjects, ""])}
              className="flex items-center gap-1 text-sm text-blue-600"
            >
              <Plus size={16} /> Add Subject
            </button>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
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
