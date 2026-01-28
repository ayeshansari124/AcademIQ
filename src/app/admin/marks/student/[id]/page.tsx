"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentMarksLayout from "@/components/marks/StudentMarksLayout";
import { useAdminStudentMarks } from "@/hooks/useAdminStudentMarks";

export default function AdminStudentMarksPage() {
  const { id } = useParams() as { id: string };
  const { data, loading } = useAdminStudentMarks(id);
  const [marks, setMarks] = useState<any[]>([]);

  useEffect(() => {
    if (data?.marks) {
      setMarks(data.marks);
    }
  }, [data]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data?.student) return <div className="p-6">Student not found</div>;

  return (
    <StudentMarksLayout
      student={data.student}
      marks={marks}
      canEdit
      onMarksAdded={(newMarks) =>
        setMarks((prev) => [...prev, ...newMarks])
      }
    />
  );
}
