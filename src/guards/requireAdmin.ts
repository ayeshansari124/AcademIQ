import { requireAuth } from "./requireAuth";

export async function requireAdmin() {
  const payload = await requireAuth();
  if (payload.role !== "ADMIN") throw new Error("FORBIDDEN");
  return payload;
}
