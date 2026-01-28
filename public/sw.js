self.addEventListener("push", event => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "AcademIQ", {
      body: data.body,
      icon: "/icon.png",
      tag: "academiq-notification",
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});
