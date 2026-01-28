import connectDB from "@/lib/db";
import { adminStudentMarksController } from "@/controllers/marks.controller";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  return adminStudentMarksController(id);
}
