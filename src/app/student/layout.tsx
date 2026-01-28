"use client";

import AppLayout from "@/components/layout/AppLayout";
import { studentSidebarConfig } from "@/components/config/sidebar.config";
import { registerPush } from "@/lib/push-client";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout
      sidebarConfig={studentSidebarConfig}
      onMount={registerPush}
    >
      {children}
    </AppLayout>
  );
}
