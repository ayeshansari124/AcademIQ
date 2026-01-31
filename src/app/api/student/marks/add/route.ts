import connectDB from "@/lib/db";
import Student from "@/models/Student";
import { createMarkController } from "@/controllers/marks.controller";
import { requireStudent } from "@/guards/requireStudent";

export async function POST(req: Request) {
  await connectDB();

  const { userId } = await requireStudent();
  const body = await req.json();

  const student = await Student.findOne({ userId });
  if (!student) {
    return Response.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  return createMarkController({
    ...body,
    studentId: student._id.toString(),
    uploadedBy: "STUDENT",
  });
}
