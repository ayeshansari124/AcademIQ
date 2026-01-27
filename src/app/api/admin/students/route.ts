import { NextResponse } from "next/server";
import { createStudent, getAllStudents } from "@/services/student.service";

export async function GET() {
  const students = await getAllStudents();
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createStudent(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
