"use client";

import { formatDateTime } from "@/utils/dateTime";

interface Assignment {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

interface Props {
  assignments: Assignment[];
  mode: "ADMIN" | "STUDENT";
}

export default function AssignmentPage({ assignments }: Props) {
  if (assignments.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No assignments yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => (
        <div
          key={a._id}
          className="rounded-lg bg-white p-4 shadow"
        >
          {/* CONTENT */}
          <p className="text-sm text-slate-800">
            {a.content}
          </p>

          {/* META */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>By {a.createdBy.name}</span>
            <span>{formatDateTime(a.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
