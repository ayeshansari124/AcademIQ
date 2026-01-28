import Student from "@/models/Student";
import FeeRecord from "@/models/FeeRecord";
import { ensureMonthlyFee } from "@/services/fees.service";

export async function getFeeProfile(studentId: string) {
  const student = await Student.findById(studentId)
    .select("fullName monthlyFee feeStartDate class")
    .populate("class", "name");

  if (!student) throw new Error("Student not found");

  await ensureMonthlyFee({
    studentId: student._id,
    classId: student.class._id,
    monthlyFee: student.monthlyFee,
    feeStartDate: student.feeStartDate,
  });

  const fees = await FeeRecord.find({ studentId })
    .sort({ year: -1, month: -1 })
    .lean();

  const now = new Date();
  const currentFee =
    fees.find(
      f => f.month === now.getMonth() + 1 && f.year === now.getFullYear()
    ) || null;

  return {
    student,
    currentFee,
    feeHistory: fees,
  };
}
