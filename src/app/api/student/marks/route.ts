import connectDB from "@/lib/db";
import { studentMarksController } from "@/controllers/marks.controller";
import { requireStudent } from "@/guards/requireStudent";

export async function GET() {
  await connectDB();

  const { userId } = await requireStudent();
  return studentMarksController(userId);
}
