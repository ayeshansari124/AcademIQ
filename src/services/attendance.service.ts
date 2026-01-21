import Attendance from "@/models/Attendance";
import ClassModel from "@/models/Class";
import Student from "@/models/Student";
import Notification from "@/models/Notification";

const MIN_ATTENDANCE_PERCENTAGE = 75;

//admin: mark attendance
export async function markAttendance({
  classId,
  date,
  records,
}: {
  classId: string;
  date: string;
  records: { student: any; status: "PRESENT" | "ABSENT" }[];
}) {
  if (!classId || !date || !records || records.length === 0) {
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

  // 2️⃣ Process students once
  const processed = new Set<string>();

  for (const record of records) {
    const studentId =
      typeof record.student === "string" ? record.student : record.student?._id;

    if (!studentId || processed.has(studentId)) continue;
    processed.add(studentId);

    const student = await Student.findById(studentId);
    if (!student) continue;

    // ABSENT notification
    if (record.status === "ABSENT") {
      await Notification.create({
        userId: student.userId,
        title: "Absent Marked",
        message: `You were marked absent on ${date}.`,
      });
    }

    // 3️ Recalculate attendance %
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
    const percentage = total === 0 ? 100 : Math.round((present / total) * 100);

    // 🔔 LOW ATTENDANCE ALERT
    const lastAlert = await Notification.findOne({
      userId: student.userId,
      title: "Low Attendance Alert",
    }).sort({ createdAt: -1 });

    const wasPreviouslyAbove =
      !lastAlert || lastAlert.createdAt < attendance.updatedAt;

    if (percentage < MIN_ATTENDANCE_PERCENTAGE && wasPreviouslyAbove) {
      await Notification.create({
        userId: student.userId,
        title: "Low Attendance Alert",
        message:
          percentage < 60
            ? "⚠️ Your attendance is critically low (below 60%). Immediate action required."
            : "⚠️ Your attendance has fallen below the required 75%.",
      });
    }
  }

  return attendance;
}

//admin: get class attendance
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

  return Attendance.findOne({
    class: classId,
    date,
  }).populate("records.student", "fullName");
}

//student attendance report
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

    daily.push({
      date: doc.date,
      status: record.status,
    });

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
  const percentage = total === 0 ? 100 : Math.round((present / total) * 100);

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
