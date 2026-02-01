"use client";

import { useParams } from "next/navigation";
import MarksPage from "@/components/pages/MarksPage";
import { useAdminStudentMarks } from "@/hooks/marks/useAdminStudentMarks";

export default function AdminStudentMarksPage() {
  const { id } = useParams() as { id: string };
  const { data, loading, reload } = useAdminStudentMarks(id);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data?.student) return <div className="p-6">Student not found</div>;

  return (
    <MarksPage
      student={data.student}
      marks={data.marks}
      canEdit
      mode="ADMIN"
      onMarksAdded={reload} 
    />
  );
}
