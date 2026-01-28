import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { AttendanceController } from "@/controllers/attendance.controller";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await ctx.params;

  const report =
    await AttendanceController.getStudentReportByStudentId(id);

  return NextResponse.json(report);
}
