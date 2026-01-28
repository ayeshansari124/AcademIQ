"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminFeesPage() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/students")
      .then(res => res.json())
      .then(res => setStudents(res.students || []));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fees Management</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Fee</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.fullName}</td>
              <td>{s.class?.name || "-"}</td>
              <td>₹{s.monthlyFee}</td>
              <td>
                <Link
                  href={`/admin/fees/student/${s._id}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
