import {
  getAllClasses,
  getClassById,
  createClass,
  deleteClass,
} from "@/services/class.service";

export async function handleGetClasses() {
  return getAllClasses();
}

export async function handleGetClass(id: string) {
  return getClassById(id);
}

export async function handleCreateClass(
  name: string,
  subjects: string[]
) {
  return createClass(name, subjects);
}

export async function handleDeleteClass(id: string) {
  return deleteClass(id);
}
