"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StudentProfileView from "@/components/student/StudentProfileView";

export default function AdminStudentProfilePage() {
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

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }

    toast.success("Student deleted");
    router.push("/admin/students");
  }

  if (loading) return <p className="p-8 text-slate-500">Loading...</p>;
  if (!student) return <p className="p-8 text-red-500">Not found</p>;

  return (
    <StudentProfileView
      student={student}
      showDelete
      onDelete={handleDelete}
      title="Student Profile"
    />
  );
}
