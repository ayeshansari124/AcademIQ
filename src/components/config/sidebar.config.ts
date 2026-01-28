import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  IndianRupee,
  Bell,
  NotebookText,
  User,
} from "lucide-react";

import { SidebarConfig } from "@/types/sidebar";

/* ADMIN */
export const adminSidebarConfig: SidebarConfig = {
  title: "AcademIQ",
  subtitle: "Admin Dashboard",
  items: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Students", icon: Users, href: "/admin/students" },
    { label: "Classes", icon: BookOpen, href: "/admin/classes" },
    { label: "Attendance", icon: ClipboardCheck, href: "/admin/attendance" },
    { label: "Marks", icon: BarChart3, href: "/admin/marks" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    { label: "Assignments", icon: NotebookText, href: "/admin/assignments" },
    { label: "Fees", icon: IndianRupee, href: "/admin/fees" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  ],
};

/* STUDENT */
export const studentSidebarConfig: SidebarConfig = {
  title: "AcademIQ",
  subtitle: "Student Dashboard",
  items: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
    { label: "Attendance", icon: ClipboardCheck, href: "/student/attendance" },
    { label: "Marks", icon: BarChart3, href: "/student/marks" },
    { label: "Fees", icon: IndianRupee, href: "/student/fees" },
    { label: "Assignments", icon: NotebookText, href: "/student/assignments" },
    { label: "Notifications", icon: Bell, href: "/student/notifications" },
    { label: "Profile", icon: User, href: "/student/profile" },
  ],
};
