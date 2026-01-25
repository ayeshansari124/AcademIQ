"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import AddExamModal from "@/components/modals/AddExamModal";
import SubjectProgressChart from "@/components/charts/SubjectProgressChart";
import ExamPerformanceChart from "@/components/charts/ExamPerformanceChart";

type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  createdAt: string;
};

export default function StudentMarksLayout({
  student,
  marks,
  canEdit = false,
}: {
  student: any;
  marks: Mark[];
  canEdit?: boolean;
}) {
  const [openExam, setOpenExam] = useState<string | null>(null);
  const [sections, setSections] = useState({
    exams: false,
    subjects: false,
    charts: false,
  });
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({});
  const [showAddExam, setShowAddExam] = useState(false);

  /* ---------- GROUP DATA ---------- */

  const marksByExam = marks.reduce<Record<string, Mark[]>>((acc, m) => {
    (acc[m.examName] ||= []).push(m);
    return acc;
  }, {});

  const marksBySubject = marks.reduce<Record<string, Mark[]>>((acc, m) => {
    (acc[m.subject] ||= []).push(m);
    return acc;
  }, {});

  function toggle(section: keyof typeof sections) {
    setSections((p) => ({ ...p, [section]: !p[section] }));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">{student.fullName}</h1>
          <p className="text-sm text-gray-600">
            Subjects: {student.subjects.join(", ")}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddExam(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            + Add Exam
          </button>
        )}
      </div>

      {/* ================= MARKS BY EXAM ================= */}
      <section>
        <button
          onClick={() => toggle("exams")}
          className="w-full flex justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Marks by Exam</h2>
          <FiChevronDown
            className={`transition-transform ${sections.exams ? "rotate-180" : ""}`}
          />
        </button>

        {sections.exams && (
          <div className="space-y-3">
            {Object.entries(marksByExam).map(([exam, examMarks]) => {
              const isOpen = openExam === exam;

              const totalObtained = examMarks.reduce(
                (s, m) => s + m.marksObtained,
                0
              );
              const totalMax = examMarks.reduce(
                (s, m) => s + m.totalMarks,
                0
              );

              const pct =
                totalMax > 0
                  ? ((totalObtained / totalMax) * 100).toFixed(1)
                  : "0.0";

              return (
                <div key={exam} className="bg-gray-50 rounded px-4">
                  <button
                    onClick={() => setOpenExam(isOpen ? null : exam)}
                    className="w-full flex justify-between py-3"
                  >
                    <span className="font-medium">
                      {exam} <span className="text-gray-500">({pct}%)</span>
                    </span>
                    <FiChevronDown
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-3 text-sm">
                      {examMarks.map((m) => (
                        <div
                          key={m._id}
                          className="flex justify-between py-1"
                        >
                          <span>{m.subject}</span>
                          <span>
                            {m.marksObtained}/{m.totalMarks}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= SUBJECT INSIGHTS ================= */}
      <section>
        <button
          onClick={() => toggle("subjects")}
          className="w-full flex justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Subject Progress</h2>
          <FiChevronDown
            className={`transition-transform ${sections.subjects ? "rotate-180" : ""}`}
          />
        </button>

        {sections.subjects && (
          <div className="space-y-4">
            {Object.entries(marksBySubject).map(([subject, subjectMarks]) => {
              const sorted = [...subjectMarks].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );

              const first =
                (sorted[0].marksObtained / sorted[0].totalMarks) * 100;
              const last =
                (sorted[sorted.length - 1].marksObtained /
                  sorted[sorted.length - 1].totalMarks) *
                100;

              const delta = last - first;

              return (
                <div key={subject} className="bg-gray-50 rounded px-4 py-3">
                  <div className="font-medium">{subject}</div>
                  <div className="text-sm text-gray-500">
                    {delta > 2 ? "Improving ↑" : delta < -2 ? "Declining ↓" : "Stable →"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= CHARTS ================= */}
      <section>
        <button
          onClick={() => toggle("charts")}
          className="w-full flex justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Performance Charts</h2>
          <FiChevronDown
            className={`transition-transform ${sections.charts ? "rotate-180" : ""}`}
          />
        </button>

        {sections.charts && (
          <div className="space-y-6">
            <ExamPerformanceChart marksByExam={marksByExam} />
            <SubjectProgressChart marks={marks} />
          </div>
        )}
      </section>

      {/* ================= ADD EXAM MODAL ================= */}
      {canEdit && showAddExam && (
        <AddExamModal
          student={student}
          onClose={() => setShowAddExam(false)}
          onSaved={() => setShowAddExam(false)}
        />
      )}
    </div>
  );
}
