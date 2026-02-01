import { requireStudent } from "@/guards/requireStudent";
import { createMarkController } from "@/controllers/marks.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { student } = await requireStudent();
    const body = await req.json();

    const mark = await createMarkController({
      ...body,
      studentId: student._id.toString(),
      uploadedBy: "STUDENT",
    });

    return NextResponse.json(mark, { status: 201 });
  } catch (err) {
    console.error("[STUDENT_MARK_ADD]", err);

    return NextResponse.json(
      { error: "Failed to submit marks" },
      { status: 500 }
    );
  }
}
