"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/students/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setStudent(data.student))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-8 text-slate-500">Loading student...</p>;
  }

  if (!student) {
    return <p className="p-8 text-red-500">Student not found</p>;
  }

  const joinedDate = new Date(student.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this student? This action cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to delete student");
      return;
    }

    toast.success("Student deleted");
    router.push("/admin/students");
  }

  return (
    <div className="p-6 space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-blue-900">
            {student.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Student Profile
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          title="Delete student"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* PERSONAL INFO */}
      <section className="rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info label="Student Name" value={student.fullName} />
          <Info label="Parent Name" value={student.parentName} />
          <Info label="Phone Number" value={student.phone} />
          <Info label="Username" value={student.userId?.username} mono />
        </div>
      </section>

      {/* ACADEMIC INFO */}
      <section className="rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
          Academic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info label="Class / Batch" value={student.class?.name} />
          <Info label="Subjects" value={student.subjects?.join(", ")} />
          <Info label="Days Attending" value={student.days?.join(", ")} />
        </div>
      </section>

      {/* FEES INFO */}
      <section className="rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
          Fee Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info label="Monthly Fees" value={`₹${student.monthlyFees}`} />
          <Info label="Admission Date" value={joinedDate} />
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------
   SMALL INLINE UI HELPER (NO EXTRA FILE)
-------------------------------------------------- */

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-slate-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
