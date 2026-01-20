import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  student: mongoose.Types.ObjectId;
  type: "LOW_ATTENDANCE";
  message: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    type: {
      type: String,
      enum: ["LOW_ATTENDANCE"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
