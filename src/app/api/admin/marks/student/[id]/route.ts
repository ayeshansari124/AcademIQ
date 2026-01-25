import connectDB from "@/lib/db";
import Student from "@/models/Student";
import Marks from "@/models/Marks";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Student ID missing" },
      { status: 400 }
    );
  }

  const student = await Student.findById(id).select(
    "fullName subjects"
  );

  const marks = await Marks.find({ studentId: id }).sort({
    createdAt: 1,
  });

  return NextResponse.json({ student, marks });
}
