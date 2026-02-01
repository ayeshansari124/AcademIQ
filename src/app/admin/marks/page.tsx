"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListCard from "@/components/common/ListCard";

export default function AdminMarksPage() {
  const [students, setStudents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/marks/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => setStudents(res.students || []));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">
          Marks Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a student to manage marks
        </p>
      </div>

      <div className="space-y-3">
        {students.map((s) => (
          <ListCard
            key={s._id}
            title={s.fullName}
            subtitle={`Class: ${s.class?.name ?? "—"}`}
            onClick={() =>
              router.push(`/admin/marks/student/${s._id}`)
            }
          />
        ))}
      </div>
    </div>
  );
}
