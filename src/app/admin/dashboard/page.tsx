import DashboardGrid from "@/components/layout/Dashboard";
import { adminDashboardTiles } from "@/components/config/dashboard.config";

export default function AdminDashboard() {
  return (
    <DashboardGrid
      title="Admin Dashboard"
      tiles={adminDashboardTiles}
    />
  );
}
