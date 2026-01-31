"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AssignmentPage from "@/components/pages/AssignmentPage";
import SendAssignmentModal from "@/components/modals/SendAssignmentModal";
import { useAssignments } from "@/hooks/assignment/useAssignments";

export default function AdminAssignmentsPage() {
  const { assignments, loading, refetch } = useAssignments(
    "/api/admin/assignments"
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Assignments</h1>
          <p className="text-sm text-slate-600">
            Create and manage assignments
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center"
        >
          <FaPlus size={18} />
        </button>
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
            await refetch(); // ✅ THIS IS THE FIX
          }}
        />
      )}
    </div>
  );
}
