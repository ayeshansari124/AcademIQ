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
    <div style={{ padding: 16 }}>
      <h2>Students</h2>

      {students.map((s) => (
        <div
          key={s._id}
          onClick={() => router.push(`/admin/marks/student/${s._id}`)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            marginBottom: 6,
            cursor: "pointer",
          }}
        >
          <strong>{s.fullName}</strong>
        </div>
      ))}
    </div>
  );
}
