import Assignment from "@/models/Assignment";

export async function createAssignment(data: {
  title: string;
  description: string;
  scope: "CLASS" | "STUDENT";
  classId?: string;
  studentIds?: string[];
  createdBy: string;
  dueDate?: string;
}) {
  return Assignment.create({
    title: data.title,
    description: data.description,
    scope: data.scope,
    classId: data.scope === "CLASS" ? data.classId : null,
    studentIds: data.scope === "STUDENT" ? data.studentIds : [],
    createdBy: data.createdBy,
    dueDate: data.dueDate,
  });
}

export async function getAllAssignments() {
  return Assignment.find().sort({ createdAt: -1 });
}

export async function getAssignmentsForStudent(studentId: string, classId: string) {
  return Assignment.find({
    isActive: true,
    $or: [
      { scope: "STUDENT", studentIds: studentId },
      { scope: "CLASS", classId },
    ],
  }).sort({ createdAt: -1 });
}
