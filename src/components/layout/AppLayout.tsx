"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { SidebarConfig } from "@/types/sidebar";

interface Props {
  children: React.ReactNode;
  sidebarConfig: SidebarConfig;
  onMount?: () => void;
}

export default function AppLayout({
  children,
  sidebarConfig,
  onMount,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        config={sidebarConfig}
      />

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
