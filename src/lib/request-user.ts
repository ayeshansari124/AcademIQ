import { headers } from "next/headers";

export async function getRequestUser() {
  const headersList = await headers();

  const userId = headersList.get("x-user-id");
  const role = headersList.get("x-user-role") as
    | "ADMIN"
    | "STUDENT"
    | null;

  if (!userId || !role) return null;

  return { userId, role };
}
