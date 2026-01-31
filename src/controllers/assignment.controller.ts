import Student from "@/models/Student";
import {
  createAssignment,
} from "../services/assignment.service";
import {
  notifyUser,
} from "@/services/push.service";
import { AssignmentType} from "@/types/assignment";

export async function createAssignmentController(
  payload: AssignmentType,
  adminUserId: string
) {
  //Create assignment (DB)
  const assignment = await createAssignment({
    ...payload,
    createdBy: adminUserId,
  });

  //Resolve target students
  let students:string[] = [];

  if (payload.scope === "CLASS" && payload.classId) {
    students = await Student.find({ class: payload.classId });
  }

  if (payload.scope === "STUDENT" && payload.studentIds?.length) {
    students = await Student.find({ _id: { $in: payload.studentIds } });
  }

  //Notify each student (DB + Push)
  for (const student of students) {
    try {
      await notifyUser(student.userId.toString(), {
        title: "New Assignment",
        body: assignment.content,
        data: { url: "/student/assignments" },
      });
    } catch {
      // swallow push errors
    }
  }
  return assignment;
}

