"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExamPerformanceChart({
  marksByExam,
}: {
  marksByExam: Record<string, any[]>;
}) {
  const data = Object.entries(marksByExam).map(
    ([exam, marks]) => {
      const totalObtained = marks.reduce(
        (s, m) => s + m.marksObtained,
        0
      );
      const totalMax = marks.reduce(
        (s, m) => s + m.totalMarks,
        0
      );

      return {
        exam,
        percentage:
          totalMax > 0
            ? ((totalObtained / totalMax) * 100).toFixed(
                1
              )
            : 0,
      };
    }
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="exam" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="percentage" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
