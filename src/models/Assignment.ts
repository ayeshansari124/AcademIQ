import mongoose, { Schema, Types } from "mongoose";

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // WHO sent it
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // TARGETING
    scope: {
      type: String,
      enum: ["STUDENT", "CLASS"],
      required: true,
    },

    // If scope === STUDENT
    studentIds: [
      {
        type: Types.ObjectId,
        ref: "Student",
      },
    ],

    // If scope === CLASS
    classId: {
      type: Types.ObjectId,
      ref: "Class",
      default: null,
    },

    dueDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
