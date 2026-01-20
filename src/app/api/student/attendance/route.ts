import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getStudentAttendanceReport } from "@/services/attendance.service";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload: any = jwt.verify(token, JWT_SECRET);

  try {
    const report = await getStudentAttendanceReport(
      payload.userId
    );
    return Response.json(report);
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
