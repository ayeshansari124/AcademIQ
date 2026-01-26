"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Student = {
  _id: string;
  fullName: string;
  class?: {
    name: string;
  };
  monthlyFee: number;
};

export default function AdminFeesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load students");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading students...</p>;

  if (students.length === 0) {
    return (
      <div className="p-6">
        <p>No students found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fees Management</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Class</th>
            <th className="p-2 text-left">Monthly Fee</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-b">
              <td className="p-2">{s.fullName}</td>
              <td className="p-2">{s.class?.name || "-"}</td>
              <td className="p-2">₹{s.monthlyFee}</td>
              <td className="p-2">
                <Link
                  href={`/admin/fees/student/${s._id}`}
                  className="text-blue-600 underline"
                >
                  View Fees
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
