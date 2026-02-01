import crypto from "crypto";
import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import Student from "@/models/Student";
import { NextResponse } from "next/server";
import User from "@/models/User";

import {
  recordUserNotification,
  recordRoleNotification,
} from "@/services/notification.service";

import { notifyAdmins } from "@/services/push.service";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feeRecordId,
    } = await req.json();

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Fetch fee record
    const fee = await FeeRecord.findById(feeRecordId);
    if (!fee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    // Mark paid
    fee.status = "PAID";
    fee.amountPaid = fee.amountDue;
    fee.paymentMethod = "ONLINE";
    fee.razorpayPaymentId = razorpay_payment_id;
    fee.paidAt = new Date();
    await fee.save();

    // Fetch student + user name
    const student = await Student.findById(fee.studentId);
    if (!student) {
      throw new Error("STUDENT_NOT_FOUND");
    }

    const user = await User.findById(student.userId).select("fullName");
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    console.log("STUDENT RAW:", student);

    const studentName = student.fullName;

    const amount = fee.amountDue;

    //STUDENT DB NOTIFICATION
    await recordUserNotification({
      userId: student.userId._id.toString(),
      type: "FEES_PAID",
      title: "Fee Payment Successful",
      message: `₹${amount} paid successfully.`,
      metadata: {
        feeRecordId: fee._id,
        amount,
      },
    });

    //ADMIN WEB+ DB NOTIFICATION
    const adminMessage = `${studentName} paid ₹${amount} fees successfully.`;

    // DB notification for admins
    await recordRoleNotification({
      role: "ADMIN",
      type: "FEES_PAID",
      title: "Fee Payment Received",
      message: adminMessage,
      metadata: {
        studentId: student._id,
        studentName,
        feeRecordId: fee._id,
        amount,
      },
    });

    // Web push for admins
    try {
      await notifyAdmins({
        title: "Fee Payment Received",
        body: adminMessage,
        data: {
          url: "/admin/fees",
        },
      });
    } catch {
      // NEVER fail payment because of push
    }

    return NextResponse.json({
      success: true,
      message: "Fee payment successful",
    });
  } catch (err) {
    console.error("FEE VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
