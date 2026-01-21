import mongoose from "mongoose";

const PushSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  subscription: {
    type: Object,
    required: true,
  },
});

export default mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSchema);
