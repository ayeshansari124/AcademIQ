import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import Notification from "@/models/Notification";
import { Types } from "mongoose";
import {
  recordUserNotification,
} from "@/services/notification.service";
import { notifyUser } from "@/services/push.service";
import User from "@/models/User";

export async function ensureMonthlyFee({
  studentId,
  classId,
  monthlyFee,
  feeStartDate,
}: {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  monthlyFee: number;
  feeStartDate: Date;
}) {
  const now = new Date();
  if (now < feeStartDate) return;

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const exists = await FeeRecord.findOne({ studentId, month, year });
  if (exists) return;

  await FeeRecord.create({
    studentId,
    classId,
    month,
    year,
    amountDue: monthlyFee,
    amountPaid: 0,
    status: "PENDING",
    dueDate: new Date(year, month - 1, 10),
  });
}

export async function markFeePaidCash(feeRecordId: string) {
  await connectDB();

  // 1️⃣ Fetch fee
  const fee = await FeeRecord.findById(feeRecordId);
  if (!fee) throw new Error("FEE_NOT_FOUND");
  if (fee.status === "PAID") throw new Error("ALREADY_PAID");

  // 2️⃣ Mark as paid
  fee.status = "PAID";
  fee.amountPaid = fee.amountDue;
  fee.paymentMethod = "CASH";
  fee.paidAt = new Date();
  await fee.save();

  // 3️⃣ Resolve student + user (NO populate)
  const student = await Student.findById(fee.studentId);
  if (!student) throw new Error("STUDENT_NOT_FOUND");

  const user = await User.findById(student.userId).select("fullName");
  if (!user) throw new Error("USER_NOT_FOUND");

  const amount = fee.amountDue;

  /* --------------------------------------------------
     STUDENT: DB NOTIFICATION
  -------------------------------------------------- */
  await recordUserNotification({
    userId: student.userId.toString(),
    type: "FEES_PAID",
    title: "Fee Payment Received",
    message: `Your ₹${amount} fee has been received (Cash).`,
    metadata: {
      feeRecordId: fee._id,
      amount,
      paymentMethod: "CASH",
    },
  });

  /* --------------------------------------------------
     STUDENT: WEB PUSH (BEST EFFORT)
  -------------------------------------------------- */
  try {
    await notifyUser(student.userId.toString(), {
      title: "Fee Payment Received",
      body: `Your ₹${amount} fee has been received (Cash).`,
      data: {
        url: "/student/fees",
      },
    });
  } catch {
    // ❌ Never fail cash marking because of push
  }

  // 4️⃣ Admin toast is handled by frontend
  return {
    success: true,
    message: "Fee marked as paid successfully",
  };
}


export async function runFeeReminder() {
  await connectDB();
  const today = new Date();

  const fees = await FeeRecord.find({
    status: { $in: ["PENDING", "OVERDUE"] },
  });

  for (const fee of fees) {
    const diff =
      Math.floor((fee.dueDate.getTime() - today.getTime()) / 86400000);

    const student = await Student.findById(fee.studentId).select("userId");
    if (!student) continue;

    if (diff === 7 || diff === 3) {
      await Notification.create({
        userId: student.userId,
        title: "Fee Reminder",
        message: `Fee ₹${fee.amountDue} due in ${diff} days`,
        type: "FEES_DUE",
        scope: "USER",
      });
    }

    if (diff < 0 && fee.status !== "OVERDUE") {
      fee.status = "OVERDUE";
      await fee.save();
    }
  }

  return { processed: fees.length };
}
