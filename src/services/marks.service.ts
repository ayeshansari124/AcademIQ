import Marks from "@/models/Marks";
import Student from "@/models/Student";
import "@/models/Class";
import {
  recordUserNotification,
  recordRoleNotification,
} from "@/services/notification.service";
import { notifyUser, notifyAdmins } from "@/services/push.service";
import { CreateMarkDTO } from "@/types/marks";

export async function getStudentsForMarks() {
  return Student.find().populate("class", "name").select("fullName class");
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

  const mark = await Marks.create({
    ...data,
    percentage,
  });

  const student = await Student.findById(data.studentId).populate(
    "userId",
    "name",
  );
  if (!student || !student.userId) return mark;

  const userId = student.userId._id.toString();
  const studentName = student.fullName;

  if (data.uploadedBy === "STUDENT") {
    const message = `${studentName} added their ${data.examName} marks.`;

    await recordRoleNotification({
      role: "ADMIN",
      type: "MARKS_UPLOADED",
      title: "Marks Submitted",
      message,
      metadata: { studentId: student._id },
    });

    await notifyAdmins({
      title: "Marks Submitted",
      body: message,
      data: { url: `/admin/marks/student/${student._id}` },
    });
  }

  if (data.uploadedBy === "ADMIN") {
    const message = `Your ${data.examName} marks have been added.`;

    await recordUserNotification({
      userId,
      type: "MARKS_UPLOADED",
      title: "Marks Added",
      message,
    });

    await notifyUser(userId, {
      title: "Marks Added",
      body: message,
      data: { url: "/student/marks" },
    });
  }

  return mark;
}
