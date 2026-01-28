import Marks from "@/models/Marks";
import Student from "@/models/Student";
import { CreateMarkDTO } from "@/types/marks";

export async function getStudentsForMarks() {
  return Student.find().select("_id fullName");
}

export async function getMarksByStudentId(studentId: string) {
  const student = await Student.findById(studentId).select("fullName subjects");
  if (!student) return { student: null, marks: [] };

  const marks = await Marks.find({ studentId }).sort({ createdAt: 1 });
  return { student, marks };
}

export async function getMarksForStudentUser(userId: string) {
  const student = await Student.findOne({ userId }).select("fullName subjects");
  if (!student) return { student: null, marks: [] };

  const marks = await Marks.find({ studentId: student._id }).sort({
    createdAt: 1,
  });

  return { student, marks };
}

export async function createMark(data: CreateMarkDTO) {
  const percentage = (data.marksObtained / data.totalMarks) * 100;

  return Marks.create({
    ...data,
    percentage,
    uploadedBy: "ADMIN",
  });
}
