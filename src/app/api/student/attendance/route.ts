import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
  userId: string;
  role: "ADMIN" | "STUDENT";
}

export async function GET() {
  await connectDB();

  /* 1️⃣ Get token */
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  if (payload.role !== "STUDENT") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  /* 2️⃣ Find student */
  const student = await Student.findOne({ userId: payload.userId });

  if (!student) {
    return Response.json({ error: "Student not found" }, { status: 404 });
  }

  /* 3️⃣ Fetch attendance docs */
  const attendanceDocs = await Attendance.find({
    "records.student": student._id,
  }).sort({ date: -1 });

  let present = 0;
  let absent = 0;

  const monthly: Record<string, { present: number; total: number }> = {};
  const daily: { date: string; status: "PRESENT" | "ABSENT" }[] = [];

  attendanceDocs.forEach((doc) => {
    const record = doc.records.find(
      (r: any) => r.student.toString() === student._id.toString()
    );

    if (!record) return;

    // daily log
    daily.push({
      date: doc.date,
      status: record.status,
    });

    // monthly aggregation
    const month = doc.date.slice(0, 7); // YYYY-MM
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
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

  /* 4️⃣ Return response */
  return Response.json({
    student: {
      name: student.fullName,
    },
    summary: {
      present,
      absent,
      total,
      percentage,
    },
    monthly,
    daily,
  });
}
