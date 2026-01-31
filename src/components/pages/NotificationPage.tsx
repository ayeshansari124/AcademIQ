import { NotificationEntity } from "@/types/notification";
import { formatDateTime } from "@/utils/dateTime";

interface Props {
  notifications: NotificationEntity[];
}

export default function NotificationPage({ notifications }: Props) {
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n._id}
          className="rounded-lg p-4 bg-white shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="font-semibold text-sm text-slate-900">
                {n.title}
              </h2>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {n.message}
              </p>
            </div>

            <span className="text-xs text-slate-500 whitespace-nowrap">
              {formatDateTime(n.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
