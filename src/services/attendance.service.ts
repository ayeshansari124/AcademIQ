import Attendance from "@/models/Attendance";
import ClassModel from "@/models/Class";
import Student from "@/models/Student";

/* --------------------------------
   ADMIN: MARK / GET ATTENDANCE
---------------------------------- */

export async function markAttendance({
  classId,
  date,
  records,
}: {
  classId: string;
  date: string;
  records: any[];
}) {
  if (!classId || !date || !records?.length) {
    throw new Error("INVALID_DATA");
  }

  const cls = await ClassModel.findById(classId);
  if (!cls) {
    throw new Error("CLASS_NOT_FOUND");
  }

  // Sunday lock
  if (new Date(date).getDay() === 0) {
    throw new Error("SUNDAY_LOCK");
  }

  // Past date lock
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    throw new Error("PAST_DATE_LOCK");
  }

  const attendance = await Attendance.findOneAndUpdate(
    { class: classId, date },
    { class: classId, date, records },
    { upsert: true, new: true }
  );

  return attendance;
}

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

/* --------------------------------
   STUDENT: ATTENDANCE REPORT
---------------------------------- */

export async function getStudentAttendanceReport(
  userId: string
) {
  const student = await Student.findOne({ userId });
  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  const attendanceDocs = await Attendance.find({
    "records.student": student._id,
  }).sort({ date: -1 });

  let present = 0;
  let absent = 0;

  const monthly: Record<string, { present: number; total: number }> = {};
  const daily: { date: string; status: "PRESENT" | "ABSENT" }[] = [];

  attendanceDocs.forEach((doc) => {
    const record = doc.records.find(
      (r: any) =>
        r.student.toString() === student._id.toString()
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
  const percentage =
    total === 0 ? 0 : Math.round((present / total) * 100);

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
