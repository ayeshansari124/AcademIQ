import mongoose, { Schema, Types, Document } from "mongoose";

export interface IAttendance extends Document {
  class: Types.ObjectId;
  date: string;
  records: {
    student: Types.ObjectId;
    status: "PRESENT" | "ABSENT";
  }[];
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    records: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: String,
          enum: ["PRESENT", "ABSENT"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate attendance for same class + date
AttendanceSchema.index({ class: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);
