import { NextResponse } from "next/server";
import * as MarksService from "../services/marks.service";
import { CreateMarkDTO } from "@/types/marks";

export async function listStudentsController() {
  const students = await MarksService.getStudentsForMarks();
  return NextResponse.json(students);
}

export async function adminStudentMarksController(studentId: string) {
  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID missing" },
      { status: 400 }
    );
  }

  const data = await MarksService.getMarksByStudentId(studentId);
  return NextResponse.json(data);
}

export async function studentMarksController(userId: string) {
  const data = await MarksService.getMarksForStudentUser(userId);
  return NextResponse.json(data);
}

export async function createMarkController(body: CreateMarkDTO) {
  const mark = await MarksService.createMark(body);
  return NextResponse.json(mark, { status: 201 });
}
