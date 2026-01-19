export default function StudentAttendancePage() {
  const attendance = {
    totalDays: 120,
    present: 108,
    absent: 12,
    percentage: "90%",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Attendance
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Total Days" value={attendance.totalDays} />
        <Stat label="Present" value={attendance.present} />
        <Stat label="Absent" value={attendance.absent} />
        <Stat label="Attendance %" value={attendance.percentage} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
