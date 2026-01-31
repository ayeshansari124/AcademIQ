import { requireAuth } from "./requireAuth";

export async function requireStudent() {
  const payload = await requireAuth();
  if (payload.role !== "STUDENT") throw new Error("FORBIDDEN");
  return payload;
}
