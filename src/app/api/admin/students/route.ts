import { NextResponse } from "next/server";
import {
  createStudent,
  getAllStudents,
} from "@/services/student.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { student, credentials } = await createStudent(body);

    return NextResponse.json({
      message: "Student created successfully",
      student: {
  id: student._id,
  fullName: student.fullName,
  class: student.class,
},     credentials,
    });
  } catch (error: any) {
    if (error.message === "VALIDATION_ERROR") {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const students = await getAllStudents();

    return NextResponse.json({ students });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
