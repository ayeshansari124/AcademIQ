"use client";

import { AttendanceReport } from "@/types/attendance";
import { formatReadableDate } from "@/utils/dateTime";

export default function AttendancePage({
  data,
  title,
}: {
  data: AttendanceReport;
  title: string;
}) {
  const { summary, monthly, daily, student } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-blue-900">{title}</h1>

        {student?.name && (
          <p className="mt-1 text-sm text-slate-600">
            Student:{" "}
            <span className="font-medium text-slate-900">{student.name}</span>
          </p>
        )}
      </div>
      {/* SUMMARY CARD */}
      <Card>
        <h2 className="font-semibold mb-6">Attendance Summary</h2>

        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          <SummaryStat
            label="Present"
            value={summary.present}
            color="text-green-600"
          />

          <SummaryStat
            label="Absent"
            value={summary.absent}
            color="text-red-600"
          />

          <SummaryStat label="Total" value={summary.total} />

          <SummaryStat
            label="Attendance"
            value={`${summary.percentage}%`}
            color={summary.percentage < 75 ? "text-red-600" : "text-green-600"}
          />
        </div>
      </Card>

      {/* LOW ATTENDANCE ALERT */}
      {summary.percentage < 75 && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 shadow-sm">
          Attendance is below the required threshold.
        </div>
      )}

      {/* MONTHLY CARD */}
      <Card>
        <h2 className="font-semibold mb-4">Monthly Breakdown</h2>

        {Object.keys(monthly).length === 0 ? (
          <Empty text="No monthly data available" />
        ) : (
          <div className="space-y-3">
            {Object.entries(monthly).map(([month, v]) => (
              <div key={month} className="flex justify-between text-sm">
                <span className="text-slate-600">{formatMonthYear(month)}</span>
                <span className="font-medium">
                  {v.present}/{v.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* DAILY LOG CARD */}
      <Card>
        <h2 className="font-semibold mb-4">Daily Log</h2>

        {daily.length === 0 ? (
          <Empty text="No attendance records found" />
        ) : (
          <div className="space-y-3">
            {daily.map((d) => (
              <div key={d.date} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {formatReadableDate(d.date)}
                </span>

                <span
                  className={`font-semibold ${
                    d.status === "PRESENT" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

//UI HELPERS

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl shadow-lg p-5">{children}</div>;
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

function SummaryStat({
  label,
  value,
  color = "text-slate-900",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
function formatMonthYear(key: string) {
  const [year, month] = key.split("-").map(Number);

  return new Date(year, month - 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
