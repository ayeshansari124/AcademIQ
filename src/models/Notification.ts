import mongoose, { Schema, Types } from "mongoose";

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "ABSENT",
        "LOW_ATTENDANCE",
        "ADMIN_BROADCAST",
        "ASSIGNMENT",
        "FEES_DUE",
        "FEES_PAID",
        "MARKS_UPLOADED",
      ],
    },

    scope: {
      type: String,
      required: true,
      enum: ["USER", "ROLE", "ALL"],
    },

    // used when scope === "USER"
    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // used when scope === "ROLE"
    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
