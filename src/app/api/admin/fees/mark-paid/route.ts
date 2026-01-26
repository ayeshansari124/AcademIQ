import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Notification from "@/models/Notification";
import Student from "@/models/Student";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { feeRecordId } = await req.json();

    if (!feeRecordId) {
      return NextResponse.json(
        { error: "FeeRecord ID required" },
        { status: 400 }
      );
    }

    const fee = await FeeRecord.findById(feeRecordId);

    if (!fee) {
      return NextResponse.json(
        { error: "Fee record not found" },
        { status: 404 }
      );
    }

    if (fee.status === "PAID") {
      return NextResponse.json(
        { error: "Fee already paid" },
        { status: 400 }
      );
    }

    fee.status = "PAID";
    fee.amountPaid = fee.amountDue;
    fee.paymentMethod = "CASH";
    fee.paidAt = new Date();

    await fee.save();

  const student = await Student.findById(fee.studentId).select("userId");

if (!student) {
  return NextResponse.json(
    { error: "Student not found for notification" },
    { status: 404 }
  );
}

await Notification.create({
  userId: student.userId,
  title: "Fee Payment Received",
  message: `Your fee of ₹${fee.amountDue} has been marked as paid.`,
  type: "FEES_PAID",
  scope: "STUDENT",
  metadata: {
    feeRecordId: fee._id,
  },
});


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark paid error:", error);
    return NextResponse.json(
      { error: "Failed to mark fee as paid" },
      { status: 500 }
    );
  }
}
