import connectDB from "@/lib/db";
import Marks from "@/models/Marks";
import { getStudentId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const studentId = await getStudentId();

  const marks = await Marks.find({ studentId }).sort({ createdAt: 1 });
  return NextResponse.json(marks);
}

export async function POST(req: Request) {
  await connectDB();
  const studentId = await getStudentId();
  const body = await req.json();

  const percentage = (body.marksObtained / body.totalMarks) * 100;

  const marks = await Marks.create({
    ...body,
    studentId,
    percentage,
    uploadedBy: "STUDENT",
  });

  return NextResponse.json(marks);
}
