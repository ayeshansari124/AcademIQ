import connectDB from "@/lib/db";
import Student from "@/models/Student";
import ClassModel from "@/models/Class";
import User from "@/models/User";

export async function deleteStudentById(studentId: string) {
  await connectDB();

  const student = await Student.findById(studentId);
  if (!student) throw new Error("STUDENT_NOT_FOUND");

  if (student.class) {
    await ClassModel.findByIdAndUpdate(
      student.class,
      { $pull: { students: student._id } }
    );
  }

  await User.findByIdAndDelete(student.userId);
  await Student.findByIdAndDelete(studentId);
}
