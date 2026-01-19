export default function StudentNotificationsPage() {
  const notifications = [
    {
      message: "Fees for August have been paid successfully.",
      time: "2 days ago",
    },
    {
      message: "New assignment added in Science.",
      time: "5 days ago",
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Notifications
      </h1>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="rounded-lg border bg-white p-4"
          >
            <p className="text-slate-700">{n.message}</p>
            <p className="mt-1 text-xs text-slate-500">
              {n.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
