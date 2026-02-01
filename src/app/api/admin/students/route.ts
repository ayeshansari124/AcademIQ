import { requireAdmin } from "@/guards/requireAdmin";
import { createStudent, getAllStudents } from "@/services/student.service";
import { NextResponse } from "next/server";

export async function GET() {
  await requireAdmin();
  const students = await getAllStudents();
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json();
  const result = await createStudent(body);
  return NextResponse.json(result);
}
