"use client";

import { useEffect, useState } from "react";
import StudentMarksLayout from "@/components/marks/StudentMarksLayout";

type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  createdAt: string;
};

export default function StudentMarksPage() {
  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/marks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setStudent(data.student);
        setMarks(data.marks);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!student) return <div className="p-6">No data available</div>;

  return (
    <StudentMarksLayout
      student={student}
      marks={marks}
      canEdit={false}
    />
  );
}
