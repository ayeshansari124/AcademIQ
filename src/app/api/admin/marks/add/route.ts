import { requireAdmin } from "@/guards/requireAdmin";
import { createMarkController } from "@/controllers/marks.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const mark = await createMarkController({
      ...body,
      uploadedBy: "ADMIN",
    });

    return NextResponse.json(mark, { status: 201 });
  } catch (err) {
    console.error("[ADMIN_MARK_ADD]", err);

    return NextResponse.json(
      { error: "Failed to add marks" },
      { status: 500 }
    );
  }
}
