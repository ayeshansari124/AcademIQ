import { Assignment } from "@/types/assignment";
import { formatDateTime } from "@/utils/dateTime";
import ContentCard from "@/components/common/ContentCard";

interface Props {
  assignments: Assignment[];
  mode: "ADMIN" | "STUDENT";
}

export default function AssignmentPage({ assignments }: Props) {
  if (!assignments.length) {
    return (
      <p className="text-sm text-slate-500">
        No assignments yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => (
        <ContentCard
          key={a._id}
          content={a.content}
          metaRight={formatDateTime(a.createdAt)}
        />
      ))}
    </div>
  );
}
