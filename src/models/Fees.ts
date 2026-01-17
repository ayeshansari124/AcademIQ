import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type FeeStatus = "PAID" | "PARTIAL" | "PENDING";

export interface IFees extends Document {
  studentId: Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  status: FeeStatus;
}

const FeesSchema = new Schema<IFees>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["PAID", "PARTIAL", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Fees: Model<IFees> =
  mongoose.models.Fees || mongoose.model<IFees>("Fees", FeesSchema);

export default Fees;
