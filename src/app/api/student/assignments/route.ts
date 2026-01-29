import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Student from "@/models/Student";
import { fetchStudentAssignments } from "@/controllers/assignment.controller";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  const payload = jwt.verify(token!, JWT_SECRET) as any;

  if (payload.role !== "STUDENT") {
    return Response.json({ assignments: [] });
  }

  const student = await Student.findOne({ userId: payload.userId });
  if (!student) return Response.json({ assignments: [] });

  const assignments = await fetchStudentAssignments(
    student._id.toString(),
    student.class.toString()
  );

  return Response.json({ assignments });
}
