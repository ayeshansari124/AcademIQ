"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AssignmentList from "@/components/assignments/AssignmentList";
import { useAssignments } from "@/hooks/useAssignments";
import SendAssignmentModal from "@/components/modals/SendAssignmentModal";

export default function AdminAssignmentsPage() {
  const { assignments, loading } = useAssignments(
    "/api/admin/assignments"
  );
  const [open, setOpen] = useState(false);

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
        Create and manage assignments for classes or students.
      </p>

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <AssignmentList
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
