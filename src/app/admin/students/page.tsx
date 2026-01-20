"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddStudentModal from "@/components/modals/AddStudentModal";
import CredentialsModal from "@/components/modals/CredentialsModal";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading students...</p>
      ) : students.length === 0 ? (
        <div className="rounded-lg border border-dashed  p-10 text-center text-slate-500">
          No students added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Link
              key={student._id}
              href={`/admin/students/${student._id}`}
              className="block"
            >
              <div className="rounded-xl p-5 shadow-sm hover:shadow-neutral-500 transition cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-800">
                  {student.fullName}
                </h3>

                <p className="text-sm text-slate-500">
                  Class: {student.classId}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Parent: {student.parentName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Phone: {student.phone}
                </p>

                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>Fees: ₹{student.monthlyFees}</span>
                  <span className="font-mono">{student.userId?.username}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && (
        <AddStudentModal
          onClose={() => setOpen(false)}
          onSuccess={(creds) => {
            setOpen(false);
            setCredentials(creds);
          }}
        />
      )}

      {credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => setCredentials(null)}
        />
      )}
    </div>
  );
}
