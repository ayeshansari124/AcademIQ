import DashboardGrid from "@/components/layout/Dashboard";
import { studentDashboardTiles } from "@/components/config/dashboard.config";

export default function StudentDashboard() {
  return (
    <DashboardGrid
      title="Student Dashboard"
      tiles={studentDashboardTiles}
    />
  );
}
