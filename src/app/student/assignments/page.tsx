"use client";
import AssignmentList from "@/components/assignments/AssignmentList";
import { useAssignments } from "@/hooks/useAssignments";
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
        <AssignmentList
          assignments={assignments}
          mode="STUDENT"
        />
      )}
    </div>
  );
}
