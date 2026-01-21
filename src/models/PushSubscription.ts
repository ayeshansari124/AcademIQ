import mongoose, { Schema } from "mongoose";

const PushSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    subscription: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSchema);