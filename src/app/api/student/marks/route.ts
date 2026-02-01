import { requireStudent } from "@/guards/requireStudent";
import { studentMarksController } from "@/controllers/marks.controller";

export async function GET() {
  const { userId } = await requireStudent();
  return studentMarksController(userId);
}
