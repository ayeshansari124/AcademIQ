import DashboardGrid, {
  DashboardTile,
} from "@/components/layout/Dashboard";

import {
  ClipboardCheck,
  BarChart3,
  IndianRupee,
  Bell,
  NotebookText,
  User,
} from "lucide-react";

export default function StudentDashboard() {
  const tiles: DashboardTile[] = [
    {
      title: "Attendance",
      icon: ClipboardCheck,
      color: "bg-indigo-500",
      href: "/student/attendance",
    },
    {
      title: "Marks",
      icon: BarChart3,
      color: "bg-yellow-500",
      href: "/student/marks",
    },
    {
      title: "Fees",
      icon: IndianRupee,
      color: "bg-emerald-500",
      href: "/student/fees",
    },
    {
      title: "Assignments",
      icon: NotebookText,
      color: "bg-orange-500",
      href: "/student/assignments",
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "bg-purple-500",
      href: "/student/notifications",
    },
    {
      title: "Profile",
      icon: User,
      color: "bg-blue-600",
      href: "/student/profile",
    },
  ];

  return (
    <DashboardGrid
      title="Student Dashboard"
      tiles={tiles}
    />
  );
}
