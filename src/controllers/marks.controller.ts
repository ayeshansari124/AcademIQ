import * as MarksService from "@/services/marks.service";
import { CreateMarkDTO } from "@/types/marks";

export async function listStudentsController() {
  return MarksService.getStudentsForMarks();
}

export async function adminStudentMarksController(studentId: string) {
  return MarksService.getMarksByStudentId(studentId);
}

export async function studentMarksController(userId: string) {
  return MarksService.getMarksForStudentUser(userId);
}

export async function createMarkController(payload: CreateMarkDTO) {
  return MarksService.createMark(payload);
}
