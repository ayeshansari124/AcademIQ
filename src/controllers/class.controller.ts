import {
  getAllClasses,
  getClassById,
  createClass,
  deleteClass,
} from "@/services/class.service";

export function handleGetClasses() {
  return getAllClasses();
}

export function handleGetClass(id: string) {
  return getClassById(id);
}

export function handleCreateClass(name: string, subjects: string[]) {
  return createClass(name, subjects);
}

export function handleDeleteClass(id: string) {
  return deleteClass(id);
}
