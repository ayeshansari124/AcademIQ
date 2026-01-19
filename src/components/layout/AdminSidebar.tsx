"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  IndianRupee,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Students", icon: Users, href: "/admin/students" },
    { label: "Classes", icon: BookOpen, href: "/admin/classes" },
    { label: "Attendance", icon: ClipboardCheck, href: "/admin/attendance" },
    { label: "Marks", icon: BarChart3, href: "/admin/marks" },
    { label: "Fees", icon: IndianRupee, href: "/admin/fees" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72
        bg-blue-900/90 backdrop-blur-md text-white
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">AcademIQ</h2>
            <span className="text-xs text-white/70">
              Admin Dashboard
            </span>
          </div>
          <X
            className="h-6 w-6 cursor-pointer hover:text-white/80"
            onClick={onClose}
          />
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-1 px-3">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm
                transition
                ${
                  isActive
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-blue-900" : ""
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
