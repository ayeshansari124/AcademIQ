import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  if (!classId || !date) {
    return NextResponse.json(
      { error: "classId and date required" },
      { status: 400 }
    );
  }

  const students = await Student.find({ class: classId })
    .select("_id fullName")
    .lean();

  const attendance = await Attendance.findOne({
    class: classId,
    date,
  })
    .populate("records.student", "fullName")
    .lean();

  return NextResponse.json({
    attendance: attendance
      ? { _id: attendance._id, records: attendance.records }
      : null,
    students,
  });
}

export async function POST(req: Request) {
  await connectDB();

  const { classId, date, records } = await req.json();

  if (!classId || !date || !records) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  await Attendance.findOneAndUpdate(
    { class: classId, date },
    {
      class: classId,
      date,
      records,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true });
}
