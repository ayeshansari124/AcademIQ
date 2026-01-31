import { getAuthPayload } from "@/lib/auth";

export async function requireAuth() {
  const payload = await getAuthPayload();
  if (!payload) throw new Error("UNAUTHORIZED");
  return payload;
}
