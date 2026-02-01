import connectDB from "@/lib/db";
import Student from "@/models/Student";
import { verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function requireStudent() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const payload = verifyAuthToken(token);

  if (payload.role !== "STUDENT") {
    throw new Error("FORBIDDEN");
  }

  const student = await Student.findOne({ userId: payload.userId });
  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  return {
    userId: payload.userId,
    student,
  };
}
