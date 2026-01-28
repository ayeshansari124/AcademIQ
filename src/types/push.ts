export interface PushPayload {
  title: string;
  body: string;
}

export interface StoredSubscription {
  userId: string;
  subscription: PushSubscription;
}

export interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
