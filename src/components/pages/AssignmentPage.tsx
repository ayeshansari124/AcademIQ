"use client";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  scope: "CLASS" | "STUDENT";
  createdAt: string;
}

interface Props {
  assignments: Assignment[];
  mode: "ADMIN" | "STUDENT";
}

export default function AssignmentPage({ assignments, mode }: Props) {
  if (assignments.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No assignments available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((a) => (
        <div
          key={a._id}
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-slate-800">
              {a.title}
            </h2>

            <span className="text-xs text-slate-500">
              {new Date(a.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-slate-700 mt-1">
            {a.description}
          </p>

          {/* 🔐 Admin-only info */}
          {mode === "ADMIN" && (
            <span className="text-xs text-blue-600 mt-2 inline-block">
              {a.scope === "CLASS"
                ? "Class Assignment"
                : "Selected Students"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
