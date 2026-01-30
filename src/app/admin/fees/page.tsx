"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminFeesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then(res => res.json())
      .then(res => setStudents(res.students || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-900">
          Fees Management
        </h1>
        <p className="text-sm text-slate-500">
          Select a student to view or manage fees.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-slate-500">Loading students…</p>
      )}

      {/* EMPTY */}
      {!loading && students.length === 0 && (
        <p className="text-sm text-slate-500">
          No students found.
        </p>
      )}

      {/* LIST */}
      {!loading && students.length > 0 && (
        <div className="space-y-3">
          {students.map((s) => (
            <Link
              key={s._id}
              href={`/admin/fees/student/${s._id}`}
              className="block rounded-xl border bg-white px-4 py-4
                         hover:border-blue-500 hover:shadow-sm
                         transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">
                    {s.fullName}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Class: {s.class?.name || "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">
                    ₹{s.monthlyFee}
                  </p>
                  <span className="text-xs text-blue-600">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
