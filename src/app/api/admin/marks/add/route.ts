import { requireAdmin } from "@/guards/requireAdmin";
import { createMarkController } from "@/controllers/marks.controller";

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json();

  return createMarkController({
    ...body,
    uploadedBy: "ADMIN",
  });
}
