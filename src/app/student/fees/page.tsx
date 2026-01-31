import FeePage from "@/components/pages/FeePage";
import { getAuthPayload } from "@/lib/auth";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

export default async function StudentFeesPage() {
  const payload = await getAuthPayload();

  if (!payload || payload.role !== "STUDENT") {
    throw new Error("UNAUTHORIZED");
  }

  await connectDB();

  const student = await Student.findOne({ userId: payload.userId }).select("_id");

  if (!student) {
    return <p>Student not found</p>;
  }

  return (
    <div className="p-6">
      <FeePage
        studentId={student._id.toString()}
        viewerRole="STUDENT"
      />
    </div>
  );
}
