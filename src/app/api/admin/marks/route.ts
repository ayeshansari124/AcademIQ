import  connectDB from "@/lib/db";
import Marks from "@/models/Marks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const percentage =
    (Number(body.marksObtained) / Number(body.totalMarks)) * 100;

  const marks = await Marks.create({
    studentId: body.studentId,
    subject: body.subject,
    examName: body.examName,
    marksObtained: body.marksObtained,
    totalMarks: body.totalMarks,
    percentage,
    academicYear: body.academicYear,
    uploadedBy: "ADMIN",
  });

  return NextResponse.json(marks);
}
