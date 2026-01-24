"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SendAssignmentModal from "@/components/modals/SendAssignmentModal";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  scope: "STUDENT" | "CLASS";
  createdAt: string;
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/assignments", { credentials: "include" })
      .then(res => res.json())
      .then(data => setAssignments(data.assignments || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-900">
          Assignments
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-full bg-blue-600 text-white
                     flex items-center justify-center hover:bg-blue-700"
        >
          <FaPlus />
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Create and manage class or student assignments.
      </p>

      {/* CONTENT */}
      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && assignments.length === 0 && (
        <p className="text-slate-500">No assignments yet.</p>
      )}

      {!loading && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a._id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between">
                <h2 className="font-semibold">{a.title}</h2>
                <span className="text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-700 mt-1">
                {a.description}
              </p>

              <span className="text-xs text-blue-600 mt-2 inline-block">
                {a.scope === "CLASS" ? "Class Assignment" : "Student Assignment"}
              </span>
            </div>
          ))}
        </div>
      )}

      {open && (
        <SendAssignmentModal
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            location.reload();
          }}
        />
      )}
    </div>
  );
}
