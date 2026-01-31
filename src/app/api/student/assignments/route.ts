import connectDB from "@/lib/db";
import Student from "@/models/Student";
import { requireStudent } from "@/guards/requireStudent";
import { getAssignmentsForStudent } from "@/services/assignment.service";

export async function GET() {
  await connectDB();

  const { userId } = await requireStudent();
  const student = await Student.findOne({ userId });

  if (!student) {
    return Response.json({ assignments: [] });
  }

  const assignments = await getAssignmentsForStudent(
    student._id.toString(),
    student.class.toString(),
  );

  return Response.json({ assignments });
}
