"use client";

import Link from "next/link";
import { useState } from "react";
import { useClasses } from "@/hooks/useClasses";
import CreateClassModal from "@/components/modals/CreateClassModal";

export default function AdminClassesPage() {
  const { classes, loading, reload } = useClasses();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Classes</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Class
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-500">Loading classes…</p>
      ) : classes.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">
          No classes created yet
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => (
            <Link
              key={cls._id}
              href={`/admin/classes/${cls._id}`}
              className="block"
            >
              <div
                className="
                  rounded-xl bg-white p-5
                  shadow-sm
                  transition
                  hover:shadow-md hover:bg-slate-50
                "
              >
                <p className="text-lg font-semibold text-slate-900">
                  {cls.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Students enrolled: {cls.students?.length || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

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
