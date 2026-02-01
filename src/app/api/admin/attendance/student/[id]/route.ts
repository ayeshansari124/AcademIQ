import { requireAdmin } from "@/guards/requireAdmin";
import { AttendanceController } from "@/controllers/attendance.controller";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await ctx.params;

  const report =
    await AttendanceController.getStudentReportByStudentId(id);

  return NextResponse.json(report);
}
