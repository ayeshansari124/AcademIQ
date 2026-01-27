"use client";

import StudentProfileView from "@/components/student/StudentProfileView";
import { useStudent } from "@/hooks/useStudent";

export default function StudentSelfProfilePage() {
  const { student, loading } = useStudent("/api/student/profile");

  if (loading) {
    return <p className="p-8 text-slate-500">Loading...</p>;
  }

  if (!student) {
    return <p className="p-8 text-red-500">Profile not found</p>;
  }

  return (
    <StudentProfileView
      student={student}
      title="Your Profile"
    />
  );
}
