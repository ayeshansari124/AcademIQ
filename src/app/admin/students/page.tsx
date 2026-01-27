"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AddStudentModal from "@/components/modals/AddStudentModal";
import CredentialsModal from "@/components/modals/CredentialsModal";
import { Student } from "@/types/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then(res => res.json())
      .then(data => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students added</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {students.map(s => (
            <Link key={s._id} href={`/admin/students/${s._id}`}>
              <div className="rounded-xl p-5 shadow-sm hover:shadow-md">
                <h3 className="font-semibold">{s.fullName}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && (
        <AddStudentModal
          onClose={() => setOpen(false)}
          onSuccess={(result) => {
            setOpen(false);                 // ✅ CLOSE MODAL
            setCredentials(result.credentials); // ✅ SHOW CREDS
            setStudents(prev => [           // ✅ UPDATE LIST
              result.student,
              ...prev,
            ]);
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
