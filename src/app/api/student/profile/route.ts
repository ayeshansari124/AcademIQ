import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStudentByStudentId } from "@/services/student.service";
import { verifyToken } from "@/lib/auth"; 

export async function GET() {
  try {
    const cookieObj= await cookies();
    const token = cookieObj.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (payload.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const student = await getStudentByStudentId(payload.userId);

    return NextResponse.json({ student });
  } catch (error: any) {
    if (error.message === "STUDENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
