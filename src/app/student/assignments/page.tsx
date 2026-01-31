"use client";

import AssignmentPage from "@/components/pages/AssignmentPage";
import { useAssignments } from "@/hooks/assignment/useAssignments";

export default function StudentAssignmentsPage() {
  const { assignments, loading } = useAssignments("/api/student/assignments");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900">Assignments</h1>
      <p className="text-sm text-slate-600 mb-6">
        View assignments allotted to you
      </p>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <AssignmentPage assignments={assignments} mode="STUDENT" />
      )}
    </div>
  );
}
