import mongoose, { Schema, Types } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null, // null = broadcast
      index: true,
    },

    scope: {
      type: String,
      enum: ["USER", "ALL"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
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
