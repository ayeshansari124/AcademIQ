"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlusFab from "@/components/common/PlusFab";
import ListCard from "@/components/common/ListCard";
import AddStudentModal from "@/components/modals/AddStudentModal";
import CredentialsModal from "@/components/modals/CredentialsModal";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/students", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* HEADER */}
     <div className="flex items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-blue-900">
      Student Management
    </h1>
    <p className="mt-1 text-sm text-slate-500">
      Manage enrolled students
    </p>
  </div>

  <PlusFab onClick={() => setOpen(true)} label="Add student" />
</div>

      {/* CONTENT */}
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
              subtitle={`Class: ${s.class?.name ?? "—"}`}
              onClick={() =>
                router.push(`/admin/students/${s._id}`)
              }
            />
          ))}
        </div>
      )}

      {open && (
        <AddStudentModal
          onClose={() => setOpen(false)}
          onSuccess={(result) => {
            setOpen(false);
            setCredentials(result.credentials);
            setStudents((prev) => [
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
