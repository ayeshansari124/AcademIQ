import connectDB from "@/lib/db";
import { loginController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  return loginController(body);
}
