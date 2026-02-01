import { requireAdmin } from "@/guards/requireAdmin";
import { AttendanceController } from "@/controllers/attendance.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  if (!classId || !date) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const data =
    await AttendanceController.getClassAttendance({ classId, date });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json();

  const attendance =
    await AttendanceController.markAttendance(body);

  return NextResponse.json({
    success: true,
    attendanceId: attendance._id,
  });
}
