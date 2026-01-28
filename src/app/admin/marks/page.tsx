"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminMarksPage() {
  const [students, setStudents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/marks/students")
      .then(res => res.json())
      .then(setStudents);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Students</h2>

      {students.map(s => (
        <div
          key={s._id}
          onClick={() => router.push(`/admin/marks/student/${s._id}`)}
          className="border p-3 mb-2 cursor-pointer hover:bg-gray-50"
        >
          {s.fullName}
        </div>
      ))}
    </div>
  );
}
