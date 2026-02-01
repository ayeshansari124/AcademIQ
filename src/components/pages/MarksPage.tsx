"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import AddExamModal from "@/components/modals/AddExamModal";
import SubjectProgressChart from "@/components/charts/SubjectProgressChart";
import ExamPerformanceChart from "@/components/charts/ExamPerformanceChart";
import PlusFab from "@/components/common/PlusFab";

type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  createdAt: string;
};

export default function MarksPage({
  student,
  marks,
  canEdit = false,
  mode,
  onMarksAdded,
}: {
  student: any;
  marks: Mark[];
  canEdit?: boolean;
  mode: "ADMIN" | "STUDENT";
  onMarksAdded?: (newMarks: Mark[]) => void;
}) {
  const [openExam, setOpenExam] = useState<string | null>(null);
  const [sections, setSections] = useState({
    exams: true,
    subjects: true,
    charts: true,
  });
  const [showAddExam, setShowAddExam] = useState(false);

  //GROUP DATA
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
    <div className="relative max-w-5xl mx-auto px-6 py-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            {student.fullName}
          </h1>
          <p className="text-sm text-slate-600">
            Subjects: {student.subjects.join(", ")}
          </p>
        </div>

        {canEdit && (
          <PlusFab onClick={() => setShowAddExam(true)} label="Add Marks" />
        )}
      </div>

      {/* MARKS BY EXAM */}
      <Card>
        <SectionHeader
          title="Marks by Exam"
          open={sections.exams}
          onClick={() => toggle("exams")}
        />

        {sections.exams && (
          <div className="space-y-3">
            {Object.entries(marksByExam).map(([exam, examMarks]) => {
              const isOpen = openExam === exam;

              const obtained = examMarks.reduce(
                (s, m) => s + m.marksObtained,
                0,
              );
              const total = examMarks.reduce((s, m) => s + m.totalMarks, 0);

              const pct =
                total > 0 ? ((obtained / total) * 100).toFixed(1) : "0.0";

              return (
                <div key={exam} className="rounded-lg">
                  <button
                    onClick={() => setOpenExam(isOpen ? null : exam)}
                    className="w-full flex justify-between py-3"
                  >
                    <span className="font-medium">
                      {exam} <span className="text-slate-500">({pct}%)</span>
                    </span>

                    <FiChevronDown
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-3 text-sm">
                      {examMarks.map((m) => (
                        <div key={m._id} className="flex justify-between py-1">
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
      </Card>

      {/* SUBJECT PROGRESS */}
      <Card>
        <SectionHeader
          title="Subject Progress"
          open={sections.subjects}
          onClick={() => toggle("subjects")}
        />

        {sections.subjects && (
          <div className="space-y-3">
            {Object.entries(marksBySubject).map(([subject, subjectMarks]) => {
              const sorted = [...subjectMarks].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );

              const first =
                (sorted[0].marksObtained / sorted[0].totalMarks) * 100;

              const last =
                (sorted[sorted.length - 1].marksObtained /
                  sorted[sorted.length - 1].totalMarks) *
                100;

              const delta = last - first;

              return (
                <div key={subject} className="rounded-lg  px-4 py-3">
                  <div className="font-medium">{subject}</div>
                  <div className="text-sm text-slate-500">
                    {delta > 2
                      ? "Improving ↑"
                      : delta < -2
                        ? "Declining ↓"
                        : "Stable →"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* PERFORMANCE CHART */}
      <Card>
        <SectionHeader
          title="Performance Charts"
          open={sections.charts}
          onClick={() => toggle("charts")}
        />

        {sections.charts && (
          <div className="space-y-6">
            <ExamPerformanceChart marksByExam={marksByExam} />
            <SubjectProgressChart marks={marks} />
          </div>
        )}
      </Card>

      {/* ADD MARKS MODAL */}
      {canEdit && showAddExam && (
        <AddExamModal
          student={student}
          mode={mode}
          onClose={() => setShowAddExam(false)}
          onSaved={(newMarks) => {
            onMarksAdded?.(newMarks);
            setShowAddExam(false);
          }}
        />
      )}
    </div>
  );
}

//UI HELPERS

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white shadow-lg p-5 space-y-4">
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  open,
  onClick,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center"
    >
      <h2 className="text-lg font-semibold">{title}</h2>

      <FiChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
    </button>
  );
}
