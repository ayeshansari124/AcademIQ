import { requireStudent } from "@/guards/requireStudent";
import { getStudentByUserId } from "@/services/student.service";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await requireStudent();

  const student = await getStudentByUserId(userId);
  return NextResponse.json({ student });
}
