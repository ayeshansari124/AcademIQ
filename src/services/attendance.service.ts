import Attendance from "@/models/Attendance";
import ClassModel from "@/models/Class";
import Student from "@/models/Student";
import PushSubscription from "@/models/PushSubscription";
import createUserNotification from "@/services/notification.service";
import { sendPush } from "@/lib/push-server";
import { Types } from "mongoose";
import { AttendanceStatus } from "@/types/attendance";

const MIN_ATTENDANCE_PERCENTAGE = 75;

// ---------- PUSH ----------
async function pushToUser(
  userId: string,
  payload: { title: string; body: string },
) {
  const sub = await PushSubscription.findOne({ userId });
  if (!sub) return;
  await sendPush(sub.subscription, payload);
}

// ---------- SUMMARY ----------
async function calculateSummary(studentId: string) {
  const docs = await Attendance.find({
    "records.student": studentId,
  });

  let present = 0;
  let absent = 0;

  for (const doc of docs) {
    const r = doc.records.find((x: any) => x.student.toString() === studentId);
    if (!r) continue;
    r.status === "PRESENT" ? present++ : absent++;
  }

  const total = present + absent;
  const percentage = total === 0 ? 100 : Math.round((present / total) * 100);

  return { present, absent, total, percentage };
}

// ---------- NOTIFICATIONS ----------
async function notifyAbsent(student: any, date: string, classId: string) {
  await createUserNotification({
    userId: student.userId,
    type: "ABSENT",
    title: "Absent Marked",
    message: `You were marked absent on ${date}.`,
    metadata: { date, classId },
  });

  await pushToUser(student.userId, {
    title: "Absent Marked",
    body: `You were marked absent on ${date}`,
  });
}

async function notifyLowAttendance(student: any, percentage: number) {
  if (percentage >= MIN_ATTENDANCE_PERCENTAGE) return;

  await createUserNotification({
    userId: student.userId,
    type: "LOW_ATTENDANCE",
    title: "Low Attendance Alert",
    message:
      percentage < 60
        ? "Attendance critically low (below 60%)."
        : "Attendance below required 75%.",
    metadata: { percentage },
  });

  await pushToUser(student.userId, {
    title: "Low Attendance Alert",
    body:
      percentage < 60
        ? "Your attendance is critically low (below 60%)."
        : "Your attendance has fallen below 75%.",
  });
}

// ---------- ADMIN ----------
export async function markAttendance({
  classId,
  date,
  records,
}: {
  classId: string;
  date: string;
  records: { student: string; status: AttendanceStatus }[];
}) {
  const cls = await ClassModel.findById(classId);
  if (!cls) throw new Error("CLASS_NOT_FOUND");

  const attendance = await Attendance.findOneAndUpdate(
    { class: classId, date },
    { class: classId, date, records },
    { upsert: true, new: true },
  );

  for (const r of records) {
    const student = await Student.findById(r.student);
    if (!student) continue;

    // 1️⃣ ABSENT notification
    if (r.status === "ABSENT") {
      await notifyAbsent(student, date, classId);
    }

    // 2️⃣ ALWAYS recalc after save
    const summary = await calculateSummary(student._id.toString());

    // 3️⃣ LOW attendance if applicable (EVERY TIME)
    await notifyLowAttendance(student, summary.percentage);
  }

  return attendance;
}

// ---------- READ ----------
export async function getClassAttendance({
  classId,
  date,
}: {
  classId: string;
  date: string;
}) {
  const attendance = await Attendance.findOne({
    class: classId,
    date,
  }).populate("records.student", "fullName");

  const students = await Student.find({ class: classId }).select(
    "_id fullName",
  );

  const recordMap = new Map<string, AttendanceStatus>();
  attendance?.records.forEach((r: any) => {
    recordMap.set(r.student._id.toString(), r.status);
  });

  const records = students.map((s) => ({
    student: { _id: s._id, fullName: s.fullName },
    status: recordMap.get(s._id.toString()) ?? "PRESENT",
  }));

  return { class: classId, date, records };
}

export async function getStudentAttendanceByUserId(userId: string) {
  const student = await Student.findOne({
    userId: new Types.ObjectId(userId),
  });
  if (!student) throw new Error("STUDENT_NOT_FOUND");

  return getStudentAttendanceByStudentId(student._id.toString());
}

export async function getStudentAttendanceByStudentId(studentId: string) {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("STUDENT_NOT_FOUND");

  const docs = await Attendance.find({
    "records.student": student._id,
  }).sort({ date: -1 });

  const monthly: Record<string, { present: number; total: number }> = {};
  const daily: { date: string; status: AttendanceStatus }[] = [];

  let present = 0;
  let absent = 0;

  for (const doc of docs) {
    const r = doc.records.find(
      (x: any) => x.student.toString() === student._id.toString(),
    );
    if (!r) continue;

    daily.push({ date: doc.date, status: r.status });

    const month = doc.date.slice(0, 7);
    monthly[month] ??= { present: 0, total: 0 };
    monthly[month].total++;

    if (r.status === "PRESENT") {
      present++;
      monthly[month].present++;
    } else {
      absent++;
    }
  }

  const total = present + absent;
  const percentage = total === 0 ? 100 : Math.round((present / total) * 100);

  return {
    student: { id: student._id, name: student.fullName },
    summary: { present, absent, total, percentage },
    monthly,
    daily,
  };
}
