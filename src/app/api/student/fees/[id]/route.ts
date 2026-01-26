import connectDB from "@/lib/db";
import Student from "@/models/Student";
import FeeRecord from "@/models/FeeRecord";
import { NextResponse } from "next/server";
import "@/models/Class";
import { ensureMonthlyFee } from "@/services/fees.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ MUST await params
    const { id: studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID missing" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch student
    const student = await Student.findById(studentId)
  .select("fullName monthlyFee feeStartDate class")
  .populate("class", "name")
  .lean();

if (!student) {
  return NextResponse.json(
    { error: "Student not found" },
    { status: 404 }
  );
}

// 🔥 AUTO-GENERATE CURRENT MONTH FEE
await ensureMonthlyFee({
  studentId: student._id,
  classId: student.class._id,
  monthlyFee: student.monthlyFee,
  feeStartDate: student.feeStartDate,
});


    // 2️⃣ Fetch fee records
    const fees = await FeeRecord.find({ studentId })
      .sort({ year: -1, month: -1 })
      .lean();

    const now = new Date();
const month = now.getMonth() + 1;
const year = now.getFullYear();

const currentFee =
  fees.find(f => f.month === month && f.year === year) || null;

    return NextResponse.json({
      student,
      currentFee,
      feeHistory: fees,
    });
  } catch (err) {
    console.error("Fetch fee error:", err);
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}
