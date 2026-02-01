"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb" // slate-200
          />

          <XAxis
            dataKey="exam"
            tick={{ fill: "#475569", fontSize: 12 }} // slate-600
            axisLine={{ stroke: "#cbd5f5" }} // blue-200
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#475569", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "#eff6ff" }} // blue-50
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#1e3a8a" }} // blue-900
          />

          <Bar
            dataKey="percentage"
            radius={[6, 6, 0, 0]}
            fill="#1e3a8a" // blue-900
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
