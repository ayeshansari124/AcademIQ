import Attendance from "@/models/Attendance";
import ClassModel from "@/models/Class";
import Student from "@/models/Student";
import Notification from "@/models/Notification";

import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push";
import createUserNotification from "@/services/notification.service"

const MIN_ATTENDANCE_PERCENTAGE = 75;

//HELPERS

async function handleAbsentNotification(student: any, date: string, classId:String) {
  // DB notification
   await createUserNotification({
      userId: student.userId,
      type: "ABSENT",
      title: "Absent Marked",
      message: `You were marked absent on ${date}.`,
      metadata: { date, classId },
    });

  // Push notification for absent
 const sub = await PushSubscription.findOne({ userId: student.userId });

if (sub) {
  await sendPush(sub.subscription, {
    title: "Absent Marked",
    body: `You were marked absent on ${date}`,
  });
}

}

async function handleLowAttendance(
  student: any,
  percentage: number,
  attendanceUpdatedAt: Date,
) {
  if (percentage >= MIN_ATTENDANCE_PERCENTAGE) return;

  // Prevent spam: check last alert
  const lastAlert = await Notification.findOne({
    userId: student.userId,
    type:"LOW_ATTENDANCE"
  }).sort({ createdAt: -1 });

  const shouldNotify =
    !lastAlert || lastAlert.createdAt < attendanceUpdatedAt;

  if (!shouldNotify) return;

  const message =
    percentage < 60
      ? "⚠️ Your attendance is critically low (below 60%). Immediate action required."
      : "⚠️ Your attendance has fallen below the required 75%.";

  // DB notification
 await createUserNotification({
        userId: student.userId,
        type: "LOW_ATTENDANCE",
        title: "⚠️ Low Attendance Alert",
        message:
          percentage < 60
            ? "Attendance critically low (below 60%)."
            : "Attendance below required 75%.",
        metadata: { percentage },
      });

  // Push notification for low attendance
  const sub = await PushSubscription.findOne({ userId: student.userId });

if (sub) {
  await sendPush(sub.subscription, {
    title: "Low Attendance Alert",
    body: percentage < 60
          ? "Your attendance is critically low (below 60%)."
          : "Your attendance has fallen below 75%.",
  });
}

 }

//MAIN SERVICE

// Admin: mark attendance
export async function markAttendance({
  classId,
  date,
  records,
}: {
  classId: string;
  date: string;
  records: { student: any; status: "PRESENT" | "ABSENT" }[];
}) {
  if (!classId || !date || !records?.length) {
    throw new Error("INVALID_DATA");
  }

  const cls = await ClassModel.findById(classId);
  if (!cls) throw new Error("CLASS_NOT_FOUND");

  if (new Date(date).getDay() === 0) {
    throw new Error("SUNDAY_LOCK");
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    throw new Error("PAST_DATE_LOCK");
  }

  // 1️⃣ Save attendance
  const attendance = await Attendance.findOneAndUpdate(
    { class: classId, date },
    { class: classId, date, records },
    { upsert: true, new: true },
  );

  // 2️⃣ Process each student once
  const processed = new Set<string>();

  for (const record of records) {
    const studentId =
      typeof record.student === "string"
        ? record.student
        : record.student?._id;

    if (!studentId || processed.has(studentId)) continue;
    processed.add(studentId);

    const student = await Student.findById(studentId);
    if (!student) continue;

    // ABSENT → notify immediately
    if (record.status === "ABSENT") {
      await handleAbsentNotification(student, date, classId);
    }

    // 3️⃣ Recalculate attendance %
    const attendanceDocs = await Attendance.find({
      "records.student": student._id,
    });

    let present = 0;
    let absent = 0;

    attendanceDocs.forEach((doc) => {
      const rec = doc.records.find(
        (r: any) => r.student.toString() === student._id.toString(),
      );
      if (!rec) return;

      rec.status === "PRESENT" ? present++ : absent++;
    });

    const total = present + absent;
    const percentage =
      total === 0 ? 100 : Math.round((present / total) * 100);

    // LOW ATTENDANCE → handled cleanly
    await handleLowAttendance(
      student,
      percentage,
      attendance.updatedAt,
    );
  }

  return attendance;
}

//READ OPERATIONS

// Admin: get class attendance
export async function getClassAttendance({
  classId,
  date,
}: {
  classId: string;
  date: string;
}) {
  if (!classId || !date) {
    throw new Error("MISSING_PARAMS");
  }

 const attendance = await Attendance.findOne({
  class: classId,
  date,
}).populate("records.student", "fullName");

if (attendance) {
  return attendance;
}

// ✅ NO ATTENDANCE YET → RETURN STUDENTS
const students = await Student.find({ class: classId }).select(
  "_id fullName"
);

return {
  class: classId,
  date,
  records: students.map((s) => ({
    student: {
      _id: s._id,
      fullName: s.fullName,
    },
    status: "PRESENT",
  })),
};

}

// Student: attendance report
export async function getStudentAttendanceReport(userId: string) {
  const student = await Student.findOne({ userId });
  if (!student) throw new Error("STUDENT_NOT_FOUND");

  const attendanceDocs = await Attendance.find({
    "records.student": student._id,
  }).sort({ date: -1 });

  let present = 0;
  let absent = 0;

  const monthly: Record<string, { present: number; total: number }> = {};
  const daily: { date: string; status: "PRESENT" | "ABSENT" }[] = [];

  attendanceDocs.forEach((doc) => {
    const record = doc.records.find(
      (r: any) => r.student.toString() === student._id.toString(),
    );
    if (!record) return;

    daily.push({ date: doc.date, status: record.status });

    const month = doc.date.slice(0, 7);
    monthly[month] ??= { present: 0, total: 0 };
    monthly[month].total++;

    if (record.status === "PRESENT") {
      present++;
      monthly[month].present++;
    } else {
      absent++;
    }
  });

  const total = present + absent;
  const percentage =
    total === 0 ? 100 : Math.round((present / total) * 100);

  return {
    student: {
      id: student._id,
      name: student.fullName,
    },
    summary: { present, absent, total, percentage },
    monthly,
    daily,
  };
}
