"use client";

import AppLayout from "@/components/layout/AppLayout";
import { adminSidebarConfig } from "@/components/config/sidebar.config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout sidebarConfig={adminSidebarConfig}>
      {children}
    </AppLayout>
  );
}
