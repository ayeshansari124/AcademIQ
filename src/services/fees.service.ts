import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import Notification from "@/models/Notification";
import { Types } from "mongoose";
import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push";
import createUserNotification from "@/services/notification.service"

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

  const month = now.getMonth() + 1; // 1–12
  const year = now.getFullYear();

  // ❗ Do not generate fees before start date
  if (now < feeStartDate) return;

  const existing = await FeeRecord.findOne({
    studentId,
    month,
    year,
  });

  if (existing) return;

  const dueDate = new Date(year, month - 1, 10); // 10th of month

  await FeeRecord.create({
    studentId,
    classId,
    month,
    year,
    amountDue: monthlyFee,
    amountPaid: 0,
    status: "PENDING",
    dueDate,
  });
}
 
function daysBetween(a: Date, b: Date) {
  const diff = a.getTime() - b.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function feeReminder() {
  await connectDB();

  const today = new Date();

  const fees = await FeeRecord.find({
    status: { $in: ["PENDING", "OVERDUE"] },
  });
for (const fee of fees) {
    const dueInDays = daysBetween(fee.dueDate, today);

    const student = await Student.findById(fee.studentId).select("userId");
    if (!student) continue;

    // D-7 REMINDER
    if (dueInDays === 7) {
       const sub = await PushSubscription.findOne({ userId: student.userId });
      
      if (sub) {
        await sendPush(sub.subscription, {
          title: "Fees Due",
          body: `Your fees is Due on ${Date}. Seven Days from now`,
        });
      }
      await Notification.create({
        userId: student.userId,
        title: "Fee Reminder",
        message: `Your monthly fee of ₹${fee.amountDue} is due in 7 days.`,
        type: "FEES_DUE",
        scope: "USER",
      });
    }
    // D-3 URGENT
    if (dueInDays === 3) {
      await Notification.create({
        userId: student.userId,
        title: "Urgent Fee Reminder",
        message: `Your fee of ₹${fee.amountDue} is due in 3 days. Please pay immediately.`,
        type: "FEES_URGENT",
        scope: "USER",
      });
    }

    // D+1 OVERDUE
    if (dueInDays < 0 && fee.status !== "OVERDUE") {
      fee.status = "OVERDUE";
      await fee.save();
       await Notification.create({
        userId: student.userId,
        title: "Fee Overdue",
        message: `Your fee of ₹${fee.amountDue} is overdue. Please pay immediately.`,
        type: "FEES_OVERDUE",
        scope: "USER",
      });
    }
  }

  return { processed: fees.length };
}
