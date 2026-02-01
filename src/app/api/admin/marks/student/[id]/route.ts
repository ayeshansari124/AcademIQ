import { requireAdmin } from "@/guards/requireAdmin";
import { adminStudentMarksController } from "@/controllers/marks.controller";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await context.params;
  return adminStudentMarksController(id);
}
