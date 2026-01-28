function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export async function registerPush() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const reg = await navigator.serviceWorker.register("/sw.js");

  let sub = await reg.pushManager.getSubscription();

  if (!sub) {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error("Missing VAPID public key");
      return;
    }

    const key = urlBase64ToUint8Array(vapidKey);

    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key as unknown as BufferSource,
    });
  }

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      subscription: sub.toJSON(),
    }),
  });
}
