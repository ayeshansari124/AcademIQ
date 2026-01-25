import mongoose, { Schema, Types } from "mongoose";

const MarksSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: { type: String, required: true },
    examName: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    academicYear: { type: String, required: true },
    uploadedBy: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Marks ||
  mongoose.model("Marks", MarksSchema);
