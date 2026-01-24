"use client";

import { useEffect, useState } from "react";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate?: string;
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/assignments", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setAssignments(data.assignments || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        Assignments
      </h1>

      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && assignments.length === 0 && (
        <p className="text-slate-500">
          No assignments assigned to you.
        </p>
      )}

      {!loading && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments.map(a => (
            <div
              key={a._id}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold">{a.title}</h2>
                <span className="text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-slate-700 mt-1">
                {a.description}
              </p>

              {a.dueDate && (
                <p className="text-xs text-red-500 mt-2">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
