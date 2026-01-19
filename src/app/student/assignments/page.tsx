export default function StudentAssignmentsPage() {
  const assignments = [
    {
      title: "Algebra Worksheet",
      subject: "Maths",
      dueDate: "20 Aug 2025",
      status: "Pending",
    },
    {
      title: "Science Lab Report",
      subject: "Science",
      dueDate: "18 Aug 2025",
      status: "Submitted",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Assignments
      </h1>

      <div className="space-y-3">
        {assignments.map((a) => (
          <div
            key={a.title}
            className="rounded-lg border bg-white p-4 flex justify-between"
          >
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-slate-500">
                {a.subject} · Due {a.dueDate}
              </p>
            </div>
            <span className="text-sm font-medium">
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
