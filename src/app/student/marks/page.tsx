export default function StudentMarksPage() {
  const marks = [
    { subject: "Maths", score: 88 },
    { subject: "Science", score: 92 },
    { subject: "English", score: 85 },
    { subject: "History", score: 78 },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Marks
      </h1>

      <div className="rounded-lg border bg-white overflow-hidden">
        {marks.map((m) => (
          <div
            key={m.subject}
            className="flex justify-between px-5 py-3 border-b last:border-b-0"
          >
            <span className="text-slate-700">{m.subject}</span>
            <span className="font-medium">{m.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
