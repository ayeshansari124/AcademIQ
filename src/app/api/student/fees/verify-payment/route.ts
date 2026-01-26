import crypto from "crypto";
import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feeRecordId,
    } = await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
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

    fee.status = "PAID";
    fee.amountPaid = fee.amountDue;
    fee.paymentMethod = "ONLINE";
    fee.razorpayPaymentId = razorpay_payment_id;
    fee.paidAt = new Date();
    await fee.save();

    const student = await Student.findById(fee.studentId).select("userId");

   if (student) {
  await Notification.create({
    userId: student.userId,
    title: "Fee Payment Successful",
    message: `Your fee of ₹${fee.amountDue} has been paid successfully.`,
    type: "FEES_PAID",
    scope: "USER",
  });
}


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify payment error", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
