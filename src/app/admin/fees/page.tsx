"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListCard from "@/components/common/ListCard";

export default function AdminFeesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setStudents(res.students || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">
          Fees Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a student to manage their fees
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading students…
        </p>
      ) : (
        <div className="space-y-3">
          {students.map((s) => (
            <ListCard
              key={s._id}
              title={s.fullName}
              subtitle={[
                `Class: ${s.class?.name ?? "—"}`,
                `Fees: ₹${s.monthlyFee}`,
              ]}
              onClick={() =>
                router.push(`/admin/fees/student/${s._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
