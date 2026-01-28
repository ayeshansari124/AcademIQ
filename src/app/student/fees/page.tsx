import FeeProfile from "@/components/fees/FeeProfile";
import { getStudentUserId } from "@/lib/auth";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

export default async function StudentFeesPage() {
  // ⚠️ This is USER ID, not student ID
  const userId = await getStudentUserId();

  await connectDB();

  // 🔑 Map USER → STUDENT
  const student = await Student.findOne({ userId }).select("_id");

  if (!student) {
    return <p className="p-6">Student not found</p>;
  }

  return (
    <div className="p-6">
      <FeeProfile
        studentId={student._id.toString()}
        viewerRole="STUDENT"
      />
    </div>
  );
}
