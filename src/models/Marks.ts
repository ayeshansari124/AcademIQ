import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MarksType = "TEST" | "EXAM" | "PARENT";

export interface IMarks extends Document {
  studentId: Types.ObjectId;
  subject: string;
  type: MarksType;
  score: number;
  maxScore: number;
  date: Date;
}

const MarksSchema = new Schema<IMarks>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: { type: String, required: true },

    type: {
      type: String,
      enum: ["TEST", "EXAM", "PARENT"],
      required: true,
    },

    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },

    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Marks: Model<IMarks> =
  mongoose.models.Marks || mongoose.model<IMarks>("Marks", MarksSchema);

export default Marks;
