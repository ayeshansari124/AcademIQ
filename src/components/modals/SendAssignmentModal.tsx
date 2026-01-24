"use client";

import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendAssignmentModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"STUDENT" | "CLASS">("CLASS");

  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔐 SAFE FETCH
  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then(async (res) => (res.ok ? res.json() : { students: [] }))
      .then((d) => setStudents(d.students || []))
      .catch(() => setStudents([]));

    fetch("/api/admin/classes", { credentials: "include" })
      .then(async (res) => (res.ok ? res.json() : { classes: [] }))
      .then((d) => setClasses(d.classes || []))
      .catch(() => setClasses([]));
  }, []);

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    if (scope === "CLASS" && !selectedClass) {
      alert("Please select a class");
      return;
    }

    if (scope === "STUDENT" && selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    setLoading(true);

    const body: any = {
      title,
      description,
      scope,
    };

    if (scope === "CLASS") body.classId = selectedClass;
    if (scope === "STUDENT") body.studentIds = selectedStudents;

    const res = await fetch("/api/admin/assignments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to send assignment");
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-lg">Send Assignment</h2>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={scope}
          onChange={(e) => {
            setScope(e.target.value as any);
            setSelectedClass("");
            setSelectedStudents([]);
          }}
        >
          <option value="CLASS">Full Class</option>
          <option value="STUDENT">Selected Students</option>
        </select>

        {scope === "CLASS" && (
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {scope === "STUDENT" && (
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
            {students.map((s) => (
              <label key={s._id} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s._id)}
                  onChange={(e) => {
                    setSelectedStudents((prev) =>
                      e.target.checked
                        ? [...prev, s._id]
                        : prev.filter((id) => id !== s._id)
                    );
                  }}
                />
                {s.fullName}
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-slate-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
