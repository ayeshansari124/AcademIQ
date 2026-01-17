import { ROLES } from "./constants";

export function isAdmin(role?: string) {
  return role === ROLES.ADMIN;
}

export function isStudent(role?: string) {
  return role === ROLES.STUDENT;
}

export function requireAdmin(role?: string) {
  if (role !== ROLES.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }
}
