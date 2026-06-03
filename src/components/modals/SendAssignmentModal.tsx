"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
    fetch("/api/admin/students", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setStudents(d.students ?? []));

    fetch("/api/admin/classes", {
      credentials: "include",
    })
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
      ...(scope === "STUDENT" && {
        studentIds: selectedStudents,
      }),
    };

    submit(payload);
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
              <h2 className="text-2xl font-bold text-slate-900">
                Send Assignment
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Send assignments to a class or selected students.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </header>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Assignment Text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assignment Content
              </label>

              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the assignment here..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  resize-none
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>

            {/* Scope */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Send To
              </label>

              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as AssignmentScope)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                "
              >
                <option value="CLASS">Entire Class</option>
                <option value="STUDENT">Selected Students</option>
              </select>
            </div>

            {/* CLASS */}
            {scope === "CLASS" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class
                </label>

                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                  "
                >
                  <option value="">Select Class</option>

                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* STUDENTS */}
            {scope === "STUDENT" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Students
                </label>

                <div
                  className="
                    border
                    rounded-2xl
                    max-h-72
                    overflow-y-auto
                    divide-y
                  "
                >
                  {students.map((s) => (
                    <label
                      key={s._id}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        hover:bg-slate-50
                        cursor-pointer
                      "
                    >
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

                      <span className="text-sm font-medium text-slate-700">
                        {s.fullName}
                      </span>
                    </label>
                  ))}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Selected: {selectedStudents.length} student(s)
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <footer className="border-t px-6 py-4 flex justify-end gap-3 shrink-0">
            <button
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
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`
                flex items-center gap-2
                rounded-xl
                px-5 py-2.5
                text-white
                font-medium
                transition
                ${
                  !isFormValid || loading
                    ? "bg-blue-700 opacity-60 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }
              `}
            >
              <FaPaperPlane size={14} />
              {loading ? "Sending..." : "Send Assignment"}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
