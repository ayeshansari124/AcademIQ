import { NextResponse } from "next/server";
import * as MarksService from "@/services/marks.service";
import { CreateMarkDTO } from "@/types/marks";

export async function listStudentsController() {
  return NextResponse.json(await MarksService.getStudentsForMarks());
}

export async function adminStudentMarksController(studentId: string) {
  return NextResponse.json(
    await MarksService.getMarksByStudentId(studentId)
  );
}

export async function studentMarksController(userId: string) {
  return NextResponse.json(
    await MarksService.getMarksForStudentUser(userId)
  );
}

export async function createMarkController(payload: CreateMarkDTO) {
  const mark = await MarksService.createMark(payload);
  return NextResponse.json(mark, { status: 201 });
}
