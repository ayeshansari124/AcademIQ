"use client";

import MarksPage from "@/components/pages/MarksPage";
import { useStudentMarks } from "@/hooks/useStudentMarks";

export default function StudentMarksPage() {
  const { data, loading } = useStudentMarks();

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data?.student) return <div className="p-6">No data available</div>;

  return (
    <MarksPage
      student={data.student}
      marks={data.marks}
      canEdit={false}
    />
  );
}
