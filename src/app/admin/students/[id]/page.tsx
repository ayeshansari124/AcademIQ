"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import OverviewTab from "./tabs/OverviewTab";
import AttendanceTab from "./tabs/AttendanceTab";
import MarksTab from "./tabs/MarksTab";
import FeesTab from "./tabs/FeesTab";
import AssignmentsTab from "./tabs/AssignmentsTab";

const TABS = ["Overview", "Attendance", "Marks", "Fees", "Assignments"] as const;

export default function StudentProfilePage() {
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
    Attendance: <AttendanceTab student={student} />,
    Marks: <MarksTab student={student} />,
    Fees: <FeesTab student={student} />,
    Assignments: <AssignmentsTab />,
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="rounded-xl px-6 py-5 shadow-sm">
        <h1 className="text-xl font-semibold text-blue-900">
          {student.fullName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Student Profile
        </p>
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
