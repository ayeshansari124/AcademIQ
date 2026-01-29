export default function NotificationList({
  notifications,
}: {
  notifications: any[];
}) {
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div key={n._id} className="rounded-lg border p-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-sm">{n.title}</h2>
              <span className="text-xs text-slate-500">
                {n.scope === "ALL"
                  ? "Broadcast"
                  : n.scope === "ROLE"
                  ? "Role based"
                  : "Personal"}
              </span>
            </div>

            <span className="text-xs text-slate-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-slate-700 mt-2">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
