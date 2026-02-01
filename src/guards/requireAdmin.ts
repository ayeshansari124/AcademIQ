import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export async function requireAdmin() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const payload = verifyAuthToken(token);

  if (payload.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return {
    userId: payload.userId,
  };
}
