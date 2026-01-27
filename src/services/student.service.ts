import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import ClassModel from "@/models/Class";
import User from "@/models/User";
import FeeRecord from "@/models/FeeRecord";
import { generateUsername } from "@/utils/generateUsername";
import { generatePassword } from "@/utils/generatePassword";

/* ---------------- READ ---------------- */

// STUDENT ID (Admin)
export async function getStudentByStudentId(studentId: string) {
  await connectDB();

  const student = await Student.findById(studentId)
    .populate("userId", "username role")
    .populate("class", "name");

  if (!student) throw new Error("STUDENT_NOT_FOUND");
  return student;
}

// USER ID (Student self)
export async function getStudentByUserId(userId: string) {
  await connectDB();

  const student = await Student.findOne({ userId })
    .populate("class", "name")
    .populate("userId", "username role"); // ✅ ADD THIS

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  return student;
}



export async function getAllStudents() {
  await connectDB();

  return Student.find()
    .populate("class", "name")
    .select("_id fullName class monthlyFee") // ✅ explicitly include _id
    .sort({ createdAt: -1 })
    .lean();
}

/* ---------------- CREATE ---------------- */

interface CreateStudentInput {
  fullName: string;
  parentName: string;
  phone: string;
  classId: string;
  subjects: string[];
  days: string[];
  monthlyFee: number;
}

export async function createStudent(data: CreateStudentInput) {
  await connectDB();

  const {
    fullName,
    parentName,
    phone,
    classId,
    subjects,
    days,
    monthlyFee,
  } = data;

  if (
    !fullName ||
    !parentName ||
    !phone ||
    !classId ||
    !subjects.length ||
    !days.length ||
    !monthlyFee
  ) {
    throw new Error("VALIDATION_ERROR");
  }

  const cls = await ClassModel.findById(classId);
  if (!cls) throw new Error("CLASS_NOT_FOUND");

  if (subjects.some(s => !cls.subjects.includes(s))) {
    throw new Error("INVALID_SUBJECT");
  }

  let username = generateUsername(fullName);
  while (await User.findOne({ username })) {
    username = generateUsername(fullName);
  }

  const plainPassword = generatePassword(fullName);
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const user = await User.create({
    name: fullName,
    username,
    passwordHash,
    role: "STUDENT",
  });

  const student = await Student.create({
    userId: user._id,
    fullName,
    parentName,
    phone,
    class: cls._id,
    subjects,
    days,
    monthlyFee,
    feeStartDate: new Date(),
  });

  cls.students.push(student._id);
  await cls.save();

  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setMonth(dueDate.getMonth() + 1);

  await FeeRecord.create({
    studentId: student._id,
    classId: cls._id,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    amountDue: monthlyFee,
    amountPaid: 0,
    status: "PENDING",
    dueDate,
  });

  return {
    student,
    credentials: {
      username,
      password: plainPassword,
    },
  };
}
