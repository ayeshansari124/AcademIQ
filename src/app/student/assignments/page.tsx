"use client";
import AssignmentPage from "@/components/pages/AssignmentPage";
import { useAssignments } from "@/hooks/assignment/useAssignments";
export default function StudentAssignmentsPage() {
  const { assignments, loading } = useAssignments(
    "/api/student/assignments"
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        Assignments
      </h1>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <AssignmentPage
          assignments={assignments}
          mode="STUDENT"
        />
      )}
    </div>
  );
}
