import connectDB from "@/lib/db";
import { studentMarksController } from "@/controllers/marks.controller";
import { getStudentUserId } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const userId = await getStudentUserId();
  return studentMarksController(userId);
}
