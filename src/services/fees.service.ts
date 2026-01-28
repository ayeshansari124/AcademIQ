import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import Notification from "@/models/Notification";
import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push-server";
import { Types } from "mongoose";

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

  const fee = await FeeRecord.findById(feeRecordId);
  if (!fee) throw new Error("Fee not found");
  if (fee.status === "PAID") throw new Error("Already paid");

  fee.status = "PAID";
  fee.amountPaid = fee.amountDue;
  fee.paymentMethod = "CASH";
  fee.paidAt = new Date();
  await fee.save();

  const student = await Student.findById(fee.studentId).select("userId");
  if (student) {
    await Notification.create({
  userId: student.userId,
  title: "Fee Payment Received",
  message: `₹${fee.amountDue} fee marked as paid.`,
  type: "FEES_PAID",
  scope: "USER", 
});

  }
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
