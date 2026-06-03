"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function ExamPerformanceChart({
  marksByExam,
}: {
  marksByExam: Record<string, any[]>;
}) {
  const data = Object.entries(marksByExam).map(([exam, marks]) => {
    const totalObtained = marks.reduce((s, m) => s + m.marksObtained, 0);

    const totalMax = marks.reduce((s, m) => s + m.totalMarks, 0);

    return {
      exam,
      percentage:
        totalMax > 0
          ? Number(((totalObtained / totalMax) * 100).toFixed(1))
          : 0,
    };
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient
              id="performanceGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

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
            formatter={(value) => [`${value}%`, "Performance"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              background: "#fff",
            }}
          />

          <Bar
            dataKey="percentage"
            radius={[10, 10, 0, 0]}
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell key={index} fill="url(#performanceGradient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
