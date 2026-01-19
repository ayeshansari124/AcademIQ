export default function AttendanceTab({ student }: { student: any }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700">
        Attendance
      </h3>
      <p className="text-slate-500">
        Total days: {student.days?.length ?? 0}
      </p>
    </div>
  );
}
