import connectDB from "@/lib/db";
import {
  createAssignmentController
} from "@/controllers/assignment.controller";
import { getAllAssignments } from "@/services/assignment.service";
import getAdmin from "@/guards/getAdmin";

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
