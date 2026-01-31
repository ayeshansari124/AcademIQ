import { NextResponse } from "next/server";
import { requireStudent } from "@/guards/requireStudent";
import { getStudentByUserId } from "@/services/student.service";

export async function GET() {
  const { userId } = await requireStudent();

  const student = await getStudentByUserId(userId);
  return NextResponse.json({ student });
}
