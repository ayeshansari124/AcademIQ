import connectDB from "@/lib/db";
import getAdmin from "@/guards/getAdmin";
import { getAllAssignments } from "@/services/assignment.service";
import { createAssignmentController } from "@/controllers/assignment.controller";

export async function GET() {
  await connectDB();
  await getAdmin();

  const assignments = await getAllAssignments();
  return Response.json({ assignments });
}

export async function POST(req: Request) {
  await connectDB();
  const admin = await getAdmin();

  const body = await req.json();
  await createAssignmentController(body, admin.userId);

  return Response.json({ success: true });
}
