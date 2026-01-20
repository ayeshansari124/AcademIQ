"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateClassModal from "@/components/modals/CreateClassModal";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function loadClasses() {
    const res = await fetch("/api/admin/classes", {
      credentials: "include",
    });
    const data = await res.json();
    setClasses(data.classes || []);
  }

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Classes</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Create Class
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {classes.map((cls) => (
          <Link
            key={cls._id}
            href={`/admin/classes/${cls._id}`}
            className="rounded-xl p-4 shadow-sm hover:shadow-neutral-500"
          >
            <h2 className="text-xl font-bold text-blue-600">
              {cls.name}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Students : {cls.students?.length || 0}
            </p>
          </Link>
        ))}
      </div>

      {open && (
        <CreateClassModal
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            loadClasses();
          }}
        />
      )}
    </div>
  );
}
