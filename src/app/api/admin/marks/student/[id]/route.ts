import { requireAdmin } from "@/guards/requireAdmin";
import { adminStudentMarksController } from "@/controllers/marks.controller";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const data = await adminStudentMarksController(id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[ADMIN_MARKS_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch marks" },
      { status: 500 },
    );
  }
}
