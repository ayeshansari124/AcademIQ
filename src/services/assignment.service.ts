import Assignment from "@/models/Assignment";
import { AssignmentType } from "@/types/assignment";

export async function createAssignment(data:AssignmentType) {
  return Assignment.create({
    content: data.content,
    scope: data.scope,
    classId: data.scope === "CLASS" ? data.classId : null,
    studentIds: data.scope === "STUDENT" ? data.studentIds : [],
    createdBy: data.createdBy,
  });
}

export async function getAllAssignments() {
  return Assignment.find()
    .populate("createdBy", "name")
    .sort({ createdAt: -1 }).limit(10);
}


export async function getAssignmentsForStudent(studentId: string, classId: string) {
  return Assignment.find({
    $or: [
      { scope: "STUDENT", studentIds: studentId },
      { scope: "CLASS", classId },
    ],
  }).populate("createdBy", "name").sort({ createdAt: -1 }).limit(10);
}
