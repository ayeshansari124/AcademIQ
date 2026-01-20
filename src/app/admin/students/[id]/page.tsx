"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import OverviewTab from "./tabs/OverviewTab";
import AttendanceTab from "./tabs/AttendanceTab";
import MarksTab from "./tabs/MarksTab";
import FeesTab from "./tabs/FeesTab";
import AssignmentsTab from "./tabs/AssignmentsTab";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const TABS = ["Overview", "Attendance", "Marks", "Fees", "Assignments"] as const;

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/students/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setStudent(data.student))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-8 text-slate-500">Loading student...</p>;
  }

  if (!student) {
    return <p className="p-8 text-red-500">Student not found</p>;
  }

  const TAB_COMPONENTS: Record<string, ReactNode> = {
    Overview: <OverviewTab student={student} />,
    Attendance: <AttendanceTab studentId={student._id} />,
    Marks: <MarksTab student={student} />,
    Fees: <FeesTab student={student} />,
    Assignments: <AssignmentsTab />,
  };

  async function handleDelete() {
  const confirmed = confirm(
    "Are you sure you want to delete this student? This action cannot be undone."
  );

  if (!confirmed) return;

  const res = await fetch(`/api/admin/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.error || "Failed to delete student");
    return;
  }

  toast.success("Student deleted");
  router.push("/admin/students");
}


  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
     <div className="flex items-center justify-between rounded-xl px-6 py-5 shadow-sm">
  <div>
    <h1 className="text-xl font-semibold text-blue-900">
      {student.fullName}
    </h1>
    <p className="mt-1 text-sm text-slate-500">
      Student Profile
    </p>
  </div>

  <button
    onClick={handleDelete}
    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
    title="Delete student"
  >
    <Trash2 size={18} />
  </button>
</div>


      {/* Tabs */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex min-w-max gap-4 px-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 text-sm font-medium transition
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl  p-6 shadow-sm">
        {TAB_COMPONENTS[activeTab]}
      </div>
    </div>
  );
}
