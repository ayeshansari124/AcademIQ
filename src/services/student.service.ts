import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import User from "@/models/User";
import Student from "@/models/Student";

import { generateUsername } from "@/utils/generateUsername";
import { generatePassword } from "@/utils/generatePassword";

//GET STUDENT BY ID
export async function getStudentByUserId(studentId: string) {
  await connectDB();

  const student = await Student.findById(studentId).populate(
    "userId",
    "username role"
  );

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  return student;
}

export async function getStudentByStudentId(userId: string) {
  await connectDB();

  const student = await Student.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  return student;
}


//GET ALL STUDENTS
export async function getAllStudents() {
  await connectDB();

  return Student.find()
    .populate("userId", "username")
    .sort({ createdAt: -1 });
}

//CREATE STUDENT
interface CreateStudentInput {
  fullName: string;
  parentName: string;
  phone: string;
  classId: string;
  subjects: string[];
  days: string[];
  monthlyFees: number;
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
    monthlyFees,
  } = data;

  // 1️⃣ Validation
  if (
    !fullName ||
    !parentName ||
    !phone ||
    !classId ||
    !subjects?.length ||
    !days?.length ||
    !monthlyFees
  ) {
    throw new Error("VALIDATION_ERROR");
  }

  // Generate unique username
  let username = generateUsername(fullName);
  let exists = await User.findOne({ username });

  while (exists) {
    username = generateUsername(fullName);
    exists = await User.findOne({ username });
  }

  // Generate password
  const plainPassword = generatePassword(fullName);
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Create User
  const user = await User.create({
    name: fullName,
    username,
    passwordHash,
    role: "STUDENT",
  });

  // Create Student
  const student = await Student.create({
    userId: user._id,
    fullName,
    parentName,
    phone,
    classId,
    subjects,
    days,
    monthlyFees,
  });

  return {
    student,
    credentials: {
      username,
      password: plainPassword,
    },
  };
}
