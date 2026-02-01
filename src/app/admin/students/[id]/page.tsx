"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProfilePage from "@/components/pages/ProfilePage";
import { useStudent } from "@/hooks/student/useStudent";

export default function AdminStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { student, loading } = useStudent(
    id ? `/api/admin/students/${id}` : "",
  );

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      toast.success("Student deleted");
      router.push("/admin/students");
      router.refresh();
    } catch {
      toast.error("Delete failed");
    }
  }

  if (!id) return <p className="p-8">Invalid student</p>;
  if (loading) return <p className="p-8">Loading...</p>;
  if (!student) return <p className="p-8">Not found</p>;

  return <ProfilePage student={student} showDelete onDelete={handleDelete} />;
}
