import connectDB from "@/lib/db";
import Student from "@/models/Student";
import { getAssignmentsForStudent } from "@/services/assignment.service";
import { requireStudent } from "@/guards/requireStudent";

export async function GET() {
  await connectDB();

  const { userId } = await requireStudent();

  const student = await Student.findOne({ userId });
  if (!student) {
    return Response.json({ assignments: [] });
  }

  const assignments = await getAssignmentsForStudent(
    student._id.toString(),
    student.class.toString()
  );

  return Response.json({ assignments });
}
