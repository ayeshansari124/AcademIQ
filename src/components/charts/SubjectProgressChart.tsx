"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Mark = {
  subject: string;
  examName: string;
  marksObtained: number;
  totalMarks: number;
  createdAt?: string;
};

const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#7c3aed", // purple
  "#ea580c", // orange
];

export default function SubjectProgressChart({
  marks,
}: {
  marks: Mark[];
}) {
  if (!marks.length) return null;

  /* ---------- BUILD EXAM AXIS ---------- */

  // Unique exams in order of appearance
  const exams = Array.from(
    new Set(marks.map((m) => m.examName))
  );

  /* ---------- BUILD CHART DATA ---------- */

  const data = exams.map((exam) => {
    const row: any = { exam };

    marks.forEach((m) => {
      if (m.examName === exam) {
        const pct =
          m.totalMarks > 0
            ? (m.marksObtained / m.totalMarks) * 100
            : 0;

        row[m.subject] = Number(pct.toFixed(1));
      }
    });

    return row;
  });

  /* ---------- UNIQUE SUBJECTS ---------- */

  const subjects = Array.from(
    new Set(marks.map((m) => m.subject))
  );

  /* ---------- UI ---------- */

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="exam" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v: number) => `${v}%`}
          />
          <Legend />

          {subjects.map((subject, i) => (
            <Line
              key={subject}
              type="monotone"
              dataKey={subject}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
