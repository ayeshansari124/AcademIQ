import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  createAssignmentController,
  fetchAdminAssignments,
} from "@/controllers/assignment.controller";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getAdmin() {
  const token = (await cookies()).get("token")?.value;
  const payload = jwt.verify(token!, JWT_SECRET) as any;
  if (payload.role !== "ADMIN") throw new Error("FORBIDDEN");
  return payload;
}

export async function GET() {
  await connectDB();
  await getAdmin();

  const assignments = await fetchAdminAssignments();
  return Response.json({ assignments });
}

export async function POST(req: Request) {
  await connectDB();
  const admin = await getAdmin();

  const body = await req.json();
  await createAssignmentController(body, admin.userId);

  return Response.json({ success: true });
}
