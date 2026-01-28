import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { AttendanceController } from "@/controllers/attendance.controller";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId")!;
  const date = searchParams.get("date")!;

  const data =
    await AttendanceController.getClassAttendance({ classId, date });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const attendance =
    await AttendanceController.markAttendance(body);

  return NextResponse.json(attendance);
}
