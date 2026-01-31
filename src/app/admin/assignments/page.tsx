"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AssignmentPage from "@/components/pages/AssignmentPage";
import { useAssignments } from "@/hooks/assignment/useAssignments";
import SendAssignmentModal from "@/components/modals/SendAssignmentModal";

export default function AdminAssignmentsPage() {
  const { assignments, loading } = useAssignments(
    "/api/admin/assignments"
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            Assignments
          </h1>
          <p className="text-sm text-slate-600">
            Create and manage assignments for classes or students.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-1 flex h-10 w-10 items-center justify-center
                     rounded-full bg-blue-600 text-white
                     hover:bg-blue-700"
          aria-label="Create assignment"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <AssignmentPage
          assignments={assignments}
          mode="ADMIN"
        />
      )}

      {/* MODAL */}
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
