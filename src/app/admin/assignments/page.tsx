"use client";

import { useState } from "react";
import AssignmentPage from "@/components/pages/AssignmentPage";
import SendAssignmentModal from "@/components/modals/SendAssignmentModal";
import { useAssignments } from "@/hooks/assignment/useAssignments";
import PlusFab from "@/components/common/PlusFab";

export default function AdminAssignmentsPage() {
  const { assignments, loading, refetch } = useAssignments(
    "/api/admin/assignments"
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            Assignments
          </h1>
          <p className="text-sm text-slate-600">
            Create and manage assignments
          </p>
        </div>

        <PlusFab onClick={() => setOpen(true)} label="Create assignment" />
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <AssignmentPage assignments={assignments} mode="ADMIN" />
      )}

      {open && (
        <SendAssignmentModal
          onClose={() => setOpen(false)}
          onSuccess={async () => {
            setOpen(false);
            await refetch();
          }}
        />
      )}
    </div>
  );
}
