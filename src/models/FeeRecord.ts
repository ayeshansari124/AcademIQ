import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type FeeStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
export type PaymentMethod = "ONLINE" | "CASH";

export interface IFeeRecord extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;

  month: number;
  year: number;

  amountDue: number;
  amountPaid: number;

  status: FeeStatus;

  dueDate: Date;
  paidAt?: Date;

  paymentMethod?: PaymentMethod;
  razorpayPaymentId?: string;
}

const FeeRecordSchema = new Schema<IFeeRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },

    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
      default: "PENDING",
    },

    dueDate: { type: Date, required: true },
    paidAt: { type: Date },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "CASH"],
    },
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

FeeRecordSchema.index(
  { studentId: 1, month: 1, year: 1 },
  { unique: true }
);

const FeeRecord: Model<IFeeRecord> =
  mongoose.models.FeeRecord ||
  mongoose.model<IFeeRecord>("FeeRecord", FeeRecordSchema);

export default FeeRecord;
