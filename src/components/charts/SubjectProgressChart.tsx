"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Mark = {
  subject: string;
  examName: string;
  marksObtained: number;
  totalMarks: number;
  createdAt?: string;
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#db2777",
];

export default function SubjectProgressChart({ marks }: { marks: Mark[] }) {
  if (!marks.length) return null;

  const exams = Array.from(new Set(marks.map((m) => m.examName)));

  const data = exams.map((exam) => {
    const row: any = { exam };

    marks.forEach((m) => {
      if (m.examName === exam) {
        row[m.subject] = Number(
          ((m.marksObtained / m.totalMarks) * 100).toFixed(1),
        );
      }
    });

    return row;
  });

  const subjects = Array.from(new Set(marks.map((m) => m.subject)));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            stroke="#e2e8f0"
            vertical={false}
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="exam"
            tick={{
              fill: "#475569",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              background: "#fff",
            }}
          />

          <Legend
            wrapperStyle={{
              paddingTop: "12px",
              fontSize: "13px",
            }}
          />

          {subjects.map((subject, i) => (
            <Line
              key={subject}
              type="monotone"
              dataKey={subject}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "#fff",
              }}
              activeDot={{
                r: 7,
              }}
              animationDuration={1200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
