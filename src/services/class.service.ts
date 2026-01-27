import connectDB from "@/lib/db";
import ClassModel from "@/models/Class";
import "@/models/Student";

export async function getAllClasses() {
  await connectDB();
  return ClassModel.find().select("_id name subjects students");
}

export async function getClassById(id: string) {
  await connectDB();

  const cls = await ClassModel.findById(id).populate(
    "students",
    "fullName"
  );

  if (!cls) {
    throw new Error("CLASS_NOT_FOUND");
  }

  return cls;
}

export async function createClass(
  name: string,
  subjects: string[]
) {
  await connectDB();

  if (!name || !subjects.length) {
    throw new Error("INVALID_DATA");
  }

  return ClassModel.create({ name, subjects });
}

export async function deleteClass(id: string) {
  await connectDB();

  const cls = await ClassModel.findById(id);
  if (!cls) throw new Error("CLASS_NOT_FOUND");

  if (cls.students.length > 0) {
    throw new Error("CLASS_HAS_STUDENTS");
  }

  await ClassModel.findByIdAndDelete(id);
}
