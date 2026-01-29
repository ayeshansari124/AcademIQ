import { use } from "react";
import FeePage from "@/components/pages/FeePage";

export default function AdminStudentFeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params
  const { id: studentId } = use(params);

  if (!studentId) {
    return <div className="p-6">Invalid student</div>;
  }

  return (
    <div className="p-6">
      <FeePage
        studentId={studentId}
        viewerRole="ADMIN"
      />
    </div>
  );
}
