"use client";

import { useEffect, useState } from "react";
import StudentProfileView from "@/components/student/StudentProfileView";

export default function StudentSelfProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/profile", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setStudent(data.student))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-slate-500">Loading...</p>;
  if (!student) return <p className="p-8 text-red-500">Profile not found</p>;

  return (
    <StudentProfileView
      student={student}
      title="Your Profile"
    />
  );
}
