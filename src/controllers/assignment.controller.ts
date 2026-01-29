import Student from "@/models/Student";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentsForStudent,
} from "../services/assignment.service";
import {
  recordUserNotification,
} from "@/services/notification.service";
import {
  notifyUser,
} from "@/services/push.service";
import { CreateAssignmentDTO } from "@/types/assignment";

export async function createAssignmentController(
  payload: CreateAssignmentDTO,
  adminUserId: string
) {
  // 1️⃣ Create assignment (DB truth)
  const assignment = await createAssignment({
    ...payload,
    createdBy: adminUserId,
  });

  // 2️⃣ Resolve target students
  let students = [];

  if (payload.scope === "CLASS" && payload.classId) {
    students = await Student.find({ class: payload.classId });
  }

  if (payload.scope === "STUDENT" && payload.studentIds?.length) {
    students = await Student.find({ _id: { $in: payload.studentIds } });
  }

  // 3️⃣ Notify each student (DB + Push)
  for (const student of students) {
    // DB notification
    await recordUserNotification({
      userId: student.userId.toString(),
      type: "ASSIGNMENT",
      title: "New Assignment",
      message: assignment.title,
      metadata: { assignmentId: assignment._id },
    });

    // Push (best effort)
    try {
      await notifyUser(student.userId.toString(), {
        title: "New Assignment",
        body: assignment.title,
        data: { url: "/student/assignments" },
      });
    } catch {
      // swallow push errors
    }
  }

  return assignment;
}

export async function fetchAdminAssignments() {
  return getAllAssignments();
}

export async function fetchStudentAssignments(studentId: string, classId: string) {
  return getAssignmentsForStudent(studentId, classId);
}
