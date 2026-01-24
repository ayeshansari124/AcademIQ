import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();
 const cookieStore= await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return Response.json({ assignments: [] });

  const payload: any = jwt.verify(token, JWT_SECRET);
  if (payload.role !== "STUDENT") {
    return Response.json({ assignments: [] }, { status: 403 });
  }

  const student = await Student.findOne({ userId: payload.userId });
  if (!student) return Response.json({ assignments: [] });

  const assignments = await Assignment.find({
    isActive: true,
    $or: [
      { scope: "STUDENT", studentIds: student._id },
      { scope: "CLASS", classId: student.class },
    ],
  }).sort({ createdAt: -1 });

  return Response.json({ assignments });
}
