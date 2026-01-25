"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentMarksLayout from "@/components/marks/StudentMarksLayout";

type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  createdAt: string;
};

export default function AdminStudentMarksPage() {
  const { id: studentId } = useParams() as { id: string };

  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    fetch(`/api/admin/marks/student/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setStudent(data.student);
        setMarks(data.marks);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <StudentMarksLayout
      student={student}
      marks={marks}
      canEdit={true} 
      onMarksUpdate={(newMarks) =>
        setMarks((prev) => [...prev, ...newMarks])
      }
    />
  );
}
