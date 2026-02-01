"use client";

import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { AssignmentScope, AssignmentCreatePayload } from "@/types/assignment";
import { useSendAssignment } from "@/hooks/assignment/useSendAssignment";

interface Props {
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function SendAssignmentModal({ onClose, onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [scope, setScope] = useState<AssignmentScope>("CLASS");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const { submit, loading } = useSendAssignment(async () => {
    await onSuccess();
  });

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setStudents(d.students ?? []));

    fetch("/api/admin/classes", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setClasses(d.classes ?? []));
  }, []);

  const isFormValid =
    content.trim().length > 0 &&
    ((scope === "CLASS" && selectedClass !== "") ||
      (scope === "STUDENT" && selectedStudents.length > 0));

  function handleSubmit() {
    if (!isFormValid) return;

    const payload: AssignmentCreatePayload = {
      content,
      scope,
      ...(scope === "CLASS" && { classId: selectedClass }),
      ...(scope === "STUDENT" && { studentIds: selectedStudents }),
    };

    submit(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-lg text-blue-900">Send Assignment</h2>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="New Assignment"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={scope}
          onChange={(e) => setScope(e.target.value as AssignmentScope)}
        >
          <option value="CLASS">Full Class</option>
          <option value="STUDENT">Selected Students</option>
        </select>

        {scope === "CLASS" && (
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
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
                  onChange={(e) =>
                    setSelectedStudents((prev) =>
                      e.target.checked
                        ? [...prev, s._id]
                        : prev.filter((id) => id !== s._id),
                    )
                  }
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
            disabled={!isFormValid || loading}
            className={`
    flex items-center justify-center
    gap-2
    px-4 py-2
    rounded-lg
    text-sm font-medium
    text-white
    transition
    ${
      !isFormValid || loading
        ? "bg-blue-800 cursor-not-allowed"
        : "bg-blue-900 hover:bg-blue-800"
    }
  `}
          >
            <FaPaperPlane className="h-4 w-4 relative top-px" />
            <span className="leading-none">
              {loading ? "Sending…" : "Send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
