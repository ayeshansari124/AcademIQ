import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import Marks from "@/models/Marks";
import { getStudentId } from "@/lib/auth"; 

export async function GET() {
  try {
    await connectDB();

    // 1️⃣ Get USER id from JWT
    const userId = await getStudentId();

    // 2️⃣ Find student by userId
    const student = await Student.findOne({
      userId,
    }).select("fullName subjects");

    if (!student) {
      return NextResponse.json(
        { student: null, marks: [] },
        { status: 200 }
      );
    }

    // 3️⃣ Fetch marks using STUDENT._id
    const marks = await Marks.find({
      studentId: student._id,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      student,
      marks,
    });
  } catch (err: any) {
    if (
      err.message === "UNAUTHORIZED" ||
      err.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        { error: err.message },
        { status: 401 }
      );
    }

    console.error("Student marks error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
