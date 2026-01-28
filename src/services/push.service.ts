import PushSubscriptionModel from "@/models/PushSubscription";
import { sendPush } from "@/lib/push-server";
import { PushPayload } from "@/types/push";

export async function saveSubscription(
  userId: string,
  subscription: PushSubscription
) {
  return PushSubscriptionModel.findOneAndUpdate(
    { userId },
    { userId, subscription },
    { upsert: true, new: true }
  );
}

export async function notifyUser(
  userId: string,
  payload: PushPayload
) {
  const doc = await PushSubscriptionModel.findOne({ userId });
  if (!doc) return;

  await sendPush(doc.subscription, payload);
}
