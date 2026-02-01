self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {

  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
  }


  const options = {
    body: data.body || "No body",
    icon: "/notification-icon.png",
    badge: "/notification-icon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "AcademIQ",
      options
    )
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
