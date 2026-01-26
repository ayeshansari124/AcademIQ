import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import FeeRecord from "@/models/FeeRecord";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { feeRecordId } = await req.json();

    const fee = await FeeRecord.findById(feeRecordId);
    if (!fee || fee.status === "PAID") {
      return NextResponse.json(
        { error: "Invalid fee record" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: fee.amountDue * 100, // paisa
      currency: "INR",
      receipt: `fee_${fee._id}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
