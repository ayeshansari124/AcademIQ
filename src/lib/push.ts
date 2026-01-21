import webPush from "web-push";

webPush.setVapidDetails(
  "mailto:admin@academiq.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPush(
  subscription: any,
  payload: { title: string; body: string }
) {
  await webPush.sendNotification(
    subscription,
    JSON.stringify(payload)
  );
}
