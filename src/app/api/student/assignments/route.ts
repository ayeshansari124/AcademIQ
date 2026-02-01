import { requireStudent } from "@/guards/requireStudent";
import { getAssignmentsForStudent } from "@/services/assignment.service";

export async function GET() {
  const { student } = await requireStudent();

  const assignments = await getAssignmentsForStudent(
    student._id.toString(),
    student.class.toString()
  );

  return Response.json({ assignments });
}
