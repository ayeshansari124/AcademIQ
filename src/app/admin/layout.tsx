"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import{adminSidebarConfig } from "@/components/config/sidebar.config";

export default function AdminLayout({
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
        config={adminSidebarConfig}
      />

      <main>{children}</main>
    </div>
  );
}
