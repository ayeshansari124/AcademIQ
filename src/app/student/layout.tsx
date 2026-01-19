"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { studentSidebarConfig } from "@/components/config/sidebar.config";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        config={studentSidebarConfig}
      />

      <main>{children}</main>
    </div>
  );
}
