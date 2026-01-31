import Student from "@/models/Student";
import { notifyUser } from "@/services/push.service";
import { createAssignment } from "@/services/assignment.service";
import { AssignmentCreatePayload } from "@/types/assignment";

export async function createAssignmentController(
  payload: AssignmentCreatePayload,
  adminUserId: string,
) {
  const assignment = await createAssignment({
    ...payload,
    createdBy: adminUserId,
  });

  let students: { userId: string }[] = [];

  if (payload.scope === "CLASS" && payload.classId) {
    students = await Student.find({ class: payload.classId }).select("userId");
  }

  if (payload.scope === "STUDENT" && payload.studentIds?.length) {
    students = await Student.find({
      _id: { $in: payload.studentIds },
    }).select("userId");
  }

  for (const student of students) {
    try {
      await notifyUser(student.userId.toString(), {
        title: "New Assignment",
        body: assignment.content,
        data: { url: "/student/assignments" },
      });
    } catch {
      // intentionally swallowed
    }
  }

  return assignment;
}
