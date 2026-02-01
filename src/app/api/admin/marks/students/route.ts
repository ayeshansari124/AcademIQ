import { requireAdmin } from "@/guards/requireAdmin";
import { listStudentsController } from "@/controllers/marks.controller";

export async function GET() {
  await requireAdmin();
  return listStudentsController();
}
