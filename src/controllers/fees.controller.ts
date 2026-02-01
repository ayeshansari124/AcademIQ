import { ensureMonthlyFee } from "@/services/fees.service";
import { formatReadableDate } from "@/utils/dateTime";
import "@/models/Class";

import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import { recordUserNotification } from "@/services/notification.service";
import { notifyUser } from "@/services/push.service";
import connectDB from "@/lib/db";

const REMINDER_DAYS = [7, 5, 3, 0];

export async function runFeeReminder() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fees = await FeeRecord.find({
    status: { $in: ["PENDING", "OVERDUE"] },
  });

  let sent = 0;

  for (const fee of fees) {
    const due = new Date(fee.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((due.getTime() - today.getTime()) / 86400000);

    if (!REMINDER_DAYS.includes(diffDays)) continue;

    // Prevent duplicate reminders
    if (fee.remindersSent?.includes(diffDays)) continue;

    const student = await Student.findById(fee.studentId).select(
      "userId fullName",
    );
    if (!student) continue;

    const title = diffDays === 0 ? "Fee Due Today" : "Fee Payment Reminder";

    const message =
      diffDays === 0
        ? `Your fee of ₹${fee.amountDue} is due TODAY.`
        : `Your fee of ₹${fee.amountDue} is due in ${diffDays} days.`;

    //DB NOTIFICATION
    await recordUserNotification({
      userId: student.userId.toString(),
      type: "FEES_DUE",
      title,
      message,
      metadata: {
        feeRecordId: fee._id,
        daysLeft: diffDays,
      },
    });

    //PUSH
    try {
      await notifyUser(student.userId.toString(), {
        title,
        body: message,
        data: {
          url: "/student/fees",
        },
      });
    } catch {
      // never fail job due to push
    }

    //MARK REMINDER AS SENT
    fee.remindersSent = [...(fee.remindersSent || []), diffDays];
    await fee.save();

    sent++;
  }

  return { processed: fees.length, sent };
}

//HELPERS

function getCycleStartDate(
  fee: { year: number; month: number },
  feeStartDate: Date,
) {
  return new Date(fee.year, fee.month - 1, feeStartDate.getDate());
}

function isActiveFee(
  fee: { year: number; month: number },
  feeStartDate: Date,
  now: Date,
) {
  const start = getCycleStartDate(fee, feeStartDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);

  return now >= start && now <= end;
}

//CONTROLLER

export async function getFeeProfile(studentId: string) {
  const student = await Student.findById(studentId)
    .select("fullName monthlyFee feeStartDate class")
    .populate("class", "name");

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  // ensure current month fee exists
  await ensureMonthlyFee({
    studentId: student._id,
    classId: student.class._id,
    monthlyFee: student.monthlyFee,
    feeStartDate: student.feeStartDate,
  });

  const fees = await FeeRecord.find({ studentId })
    .sort({ year: -1, month: -1 })
    .lean();

  const now = new Date();

  //CURRENT FEE
  const active = fees.find((f) => isActiveFee(f, student.feeStartDate, now));

  const currentFee = active
    ? {
        _id: active._id,
        date: formatReadableDate(
          getCycleStartDate(active, student.feeStartDate),
        ),
        amount: active.amountDue,
        status: active.status,
        mode: active.status === "PAID" ? (active.paymentMethod ?? "CASH") : "-",
      }
    : null;

  //HISTORY
  const feeHistory = fees.map((f) => {
    const cycleStart = getCycleStartDate(f, student.feeStartDate);

    return {
      _id: f._id,
      date: formatReadableDate(cycleStart),
      amount: f.amountDue,
      status: f.status,
      mode: f.status === "PAID" ? (f.paymentMethod ?? "CASH") : "-",
    };
  });

  return {
    student: {
      fullName: student.fullName,
      monthlyFee: student.monthlyFee,
      class: student.class,
    },
    currentFee,
    feeHistory,
  };
}
