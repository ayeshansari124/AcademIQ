"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useClasses } from "@/hooks/class/useClasses";
import ListCard from "@/components/common/ListCard";
import CreateClassModal from "@/components/modals/CreateClassModal";
import PlusFab from "@/components/common/PlusFab";

export default function AdminClassesPage() {
  const { classes, loading, reload } = useClasses();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* HEADER */}
<div className="flex items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-blue-900">Class Management</h1>
    <p className="mt-1 text-sm text-slate-500">
      Manage classes and enrolled students
    </p>
  </div>

  <PlusFab onClick={() => setOpen(true)} label="Create class" />
</div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-sm text-slate-500">
          Loading classes…
        </p>
      ) : classes.length === 0 ? (
        <p className="text-sm text-slate-500">
          No classes created yet.
        </p>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <ListCard
              key={cls._id}
              title={cls.name}
              subtitle={`Students enrolled: ${
                cls.students?.length || 0
              }`}
              onClick={() =>
                router.push(`/admin/classes/${cls._id}`)
              }
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <CreateClassModal
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            reload();
          }}
        />
      )}
    </div>
  );
}
