import { requireStudent } from "@/guards/requireStudent";
import { createMarkController } from "@/controllers/marks.controller";

export async function POST(req: Request) {
  const { student } = await requireStudent();
  const body = await req.json();

  return createMarkController({
    ...body,
    studentId: student._id.toString(),
    uploadedBy: "STUDENT",
  });
}
