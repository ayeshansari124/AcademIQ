import { NextResponse } from "next/server";
import { getStudentById } from "@/services/student.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const student = await getStudentById(id);

    return NextResponse.json({ student });
  } catch (error: any) {
    if (error.message === "STUDENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}
