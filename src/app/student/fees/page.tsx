import FeePage from "@/components/pages/FeePage";
import { requireStudent } from "@/guards/requireStudent";

export default async function StudentFeesPage() {
  const { student } = await requireStudent();

  return (
    <div className="p-6">
      <FeePage
        studentId={student._id.toString()}
        viewerRole="STUDENT"
      />
    </div>
  );
}
