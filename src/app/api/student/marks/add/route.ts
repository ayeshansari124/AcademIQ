import connectDB from "@/lib/db";
import { createMarkController } from "@/controllers/marks.controller";
import { getStudentUserId } from "@/lib/auth";
import Student from "@/models/Student";

export async function POST(req: Request) {
  await connectDB();

  const userId = await getStudentUserId();
  const body = await req.json();

  const student = await Student.findOne({ userId });
  if (!student) {
    return new Response(JSON.stringify({ error: "Student not found" }), {
      status: 404,
    });
  }

  return createMarkController({
    ...body,
    studentId: student._id.toString(),
    uploadedBy: "STUDENT", 
  });
}
