"use client";

import { AttendanceReport } from "@/types/attendance";

export default function AttendancePage({
  data,
  title,
}: {
  data: AttendanceReport;
  title: string;
}) {
  const { summary, monthly, daily, student } = data;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">
        {title}
      </h1>

      {student?.name && (
        <p className="text-sm text-slate-600">
          Student:{" "}
          <span className="font-medium text-slate-900">
            {student.name}
          </span>
        </p>
      )}

      <Section title="Summary">
        <Stat label="Present" value={summary.present} />
        <Stat label="Absent" value={summary.absent} />
        <Stat label="Total" value={summary.total} />
        <Stat
          label="%"
          value={`${summary.percentage}%`}
          danger={summary.percentage < 75}
        />
      </Section>

      {summary.percentage < 75 && (
        <div className="rounded-lg border p-3 text-sm border-red-500 bg-red-50 text-red-700">
          Attendance below required threshold.
        </div>
      )}

      <Section title="Monthly">
        {Object.keys(monthly).length === 0 ? (
          <Empty text="No monthly data" />
        ) : (
          Object.entries(monthly).map(([m, v]) => (
            <div key={m} className="flex justify-between text-sm">
              <span>{m}</span>
              <span>
                {v.present}/{v.total}
              </span>
            </div>
          ))
        )}
      </Section>

      <Section title="Daily Log">
        {daily.length === 0 ? (
          <Empty text="No attendance records" />
        ) : (
          daily.map(d => (
            <div
              key={d.date}
              className="flex justify-between text-sm"
            >
              <span>{formatDate(d.date)}</span>
              <span
                className={
                  d.status === "PRESENT"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {d.status}
              </span>
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="text-sm">
      {label}:{" "}
      <b className={danger ? "text-red-600" : ""}>
        {value}
      </b>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}
