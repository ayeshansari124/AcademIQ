import { requireAdmin } from "@/guards/requireAdmin";
import { getAllAssignments } from "@/services/assignment.service";
import { createAssignmentController } from "@/controllers/assignment.controller";

export async function GET() {
  await requireAdmin();
  const assignments = await getAllAssignments();
  return Response.json({ assignments });
}

export async function POST(req: Request) {
  const { userId } = await requireAdmin();
  const body = await req.json();

  await createAssignmentController(body, userId);
  return Response.json({ success: true });
}
