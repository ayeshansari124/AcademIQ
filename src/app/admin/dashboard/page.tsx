import DashboardGrid, {
  DashboardTile,
} from "@/components/layout/Dashboard";

import {
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Bell,
  NotebookText,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {
  const tiles: DashboardTile[] = [
    {
      title: "Students",
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/students",
    },
    {
      title: "Classes",
      icon: BookOpen,
      color: "bg-green-500",
      href: "/admin/classes",
    },
    {
      title: "Attendance",
      icon: ClipboardCheck,
      color: "bg-indigo-500",
      href: "/admin/attendance",
    },
    {
      title: "Marks",
      icon: BarChart3,
      color: "bg-yellow-500",
      href: "/admin/marks",
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "bg-purple-500",
      href: "/admin/notifications",
    },
    {
      title: "Assignments",
      icon: NotebookText,
      color: "bg-orange-500",
      href: "/admin/assignments",
    },
    {
      title: "Fees",
      icon: IndianRupee,
      color: "bg-emerald-500",
      href: "/admin/fees",
    },
    {
      title: "Reports",
      icon: BarChart3,
      color: "bg-red-500",
      href: "/admin/reports",
    },
  ];

  return (
    <DashboardGrid
      title="Admin Dashboard"
      tiles={tiles}
    />
  );
}
