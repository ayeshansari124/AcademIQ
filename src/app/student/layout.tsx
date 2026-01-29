"use client";

import AppLayout from "@/components/layout/AppLayout";
import { studentSidebarConfig } from "@/components/config/sidebar.config";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout
      sidebarConfig={studentSidebarConfig}
    >
      {children}
    </AppLayout>
  );
}
