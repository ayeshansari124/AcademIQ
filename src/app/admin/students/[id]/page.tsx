"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StudentProfileView from "@/components/student/StudentProfileView";
import { useStudent } from "@/hooks/useStudent";

export default function AdminStudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { student, loading } = useStudent(`/api/admin/students/${id}`);

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`/api/admin/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Student deleted");
    router.push("/admin/students");
  }

  if (loading) return <p className="p-8">Loading...</p>;
  if (!student) return <p className="p-8">Not found</p>;

  return (
    <StudentProfileView
      student={student}
      showDelete
      onDelete={handleDelete}
    />
  );
}
