import mongoose, { Schema, Types } from "mongoose";

const AssignmentSchema = new Schema(
  {
    content: { type: String, required: true },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    scope: {
      type: String,
      enum: ["STUDENT", "CLASS"],
      required: true,
    },

    studentIds: [
      {
        type: Types.ObjectId,
        ref: "Student",
      },
    ],

    classId: {
      type: Types.ObjectId,
      ref: "Class",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
