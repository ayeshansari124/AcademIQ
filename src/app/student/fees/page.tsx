import FeeProfile from "@/components/fees/FeeProfile";
import { getStudentUserId } from "@/lib/auth";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

export default async function StudentFeesPage() {
  const userId = await getStudentUserId();
  await connectDB();

  const student = await Student.findOne({ userId }).select("_id");
  if (!student) return <p>Student not found</p>;

  return (
    <div className="p-6">
      <FeeProfile
        studentId={student._id.toString()}
        viewerRole="STUDENT"
      />
    </div>
  );
}
