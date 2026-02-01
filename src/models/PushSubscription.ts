import mongoose, { Schema } from "mongoose";

const PushSubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSubscriptionSchema);
