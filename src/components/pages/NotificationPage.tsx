import { NotificationEntity } from "@/types/notification";
import { formatDateTime } from "@/utils/dateTime";
import ContentCard from "@/components/common/ContentCard";

interface Props {
  notifications: NotificationEntity[];
}

export default function NotificationPage({ notifications }: Props) {
  if (!notifications.length) {
    return <p className="text-sm text-slate-500">No notifications yet.</p>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <ContentCard
          key={n._id}
          title={n.title}
          content={n.message}
          metaRight={formatDateTime(n.createdAt)}
        />
      ))}
    </div>
  );
}
