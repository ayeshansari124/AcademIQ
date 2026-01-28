import webpush from "web-push";
import { PushPayload, WebPushSubscription } from "@/types/push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPush(
  subscription: WebPushSubscription,
  payload: PushPayload
) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify(payload)
  );
}
