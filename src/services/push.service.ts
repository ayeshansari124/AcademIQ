import PushModel from "@/models/PushSubscription";
import { sendPush } from "@/lib/push-server";
import User from "@/models/User";

export async function saveSubscription(userId: string, sub: any) {
  return PushModel.findOneAndUpdate(
    { endpoint: sub.endpoint },
    {
      userId,
      endpoint: sub.endpoint,
      subscription: sub,
    },
    { upsert: true },
  );
}

export async function removeSubscription(endpoint: string) {
  return PushModel.deleteOne({ endpoint });
}

// NOTIFICATIONS
export async function notifyUser(userId: string, payload: any) {
  const subs = await PushModel.find({ userId });

  for (const s of subs) {
    try {
      const res = await sendPush(s.subscription, payload);
    } catch (err: any) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await PushModel.deleteOne({ _id: s._id });
      }
    }
  }
}

export async function notifyUsers(userIds: string[], payload: any) {
  const subs = await PushModel.find({ userId: { $in: userIds } });
  await Promise.all(subs.map((s) => sendPush(s.subscription, payload)));
}

export async function notifyAll(payload: any) {
  const subs = await PushModel.find();
  await Promise.all(subs.map((s) => sendPush(s.subscription, payload)));
}

// NOTIFY ALL ADMINS
export async function notifyAdmins(payload: any) {
  //Get admin user IDs
  const admins = await User.find({ role: "ADMIN" }).select("_id");

  if (!admins.length) return;

  const adminIds = admins.map((a) => a._id);

  // Get their push subscriptions
  const subs = await PushModel.find({
    userId: { $in: adminIds },
  });

  // Send push safely
  for (const s of subs) {
    try {
      await sendPush(s.subscription, payload);
    } catch (err: any) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await PushModel.deleteOne({ _id: s._id });
      }
    }
  }
}
