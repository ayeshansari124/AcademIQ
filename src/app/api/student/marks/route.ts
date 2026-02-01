import { requireStudent } from "@/guards/requireStudent";
import { studentMarksController } from "@/controllers/marks.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await requireStudent();
    const data = await studentMarksController(userId);

    return NextResponse.json(data);
  } catch (err) {
    console.error("[STUDENT_MARKS_GET]", err);
    return NextResponse.json(
      { error: "Failed to load marks" },
      { status: 500 },
    );
  }
}
