"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { ChevronDown } from "lucide-react";

import AddExamModal from "@/components/modals/AddExamModal";
import SubjectProgressChart from "@/components/charts/SubjectProgressChart";
import ExamPerformanceChart from "@/components/charts/ExamPerformanceChart";

type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  createdAt: string;
};

export default function StudentMarksPage() {
  const { id: studentId } = useParams() as { id: string };

  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<Mark[]>([]);

  /* ---------- GLOBAL SECTION TOGGLES ---------- */
  const [sections, setSections] = useState({
    exams: false,
    examChart: false,
    subjects: false,
    subjectChart: false,
  });

  const [openExam, setOpenExam] = useState<string | null>(null);
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({});
  const [showAddExam, setShowAddExam] = useState(false);

  function toggleSection(key: keyof typeof sections) {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  /* ---------- FETCH ---------- */
  useEffect(() => {
    fetch(`/api/admin/marks/student/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.student);
        setMarks(data.marks);
      });
  }, [studentId]);

  if (!student) return <div className="p-6">Loading…</div>;

  /* ---------- GROUP DATA ---------- */
  const marksByExam = marks.reduce<Record<string, Mark[]>>((acc, m) => {
    (acc[m.examName] ||= []).push(m);
    return acc;
  }, {});

  const marksBySubject = marks.reduce<Record<string, Mark[]>>((acc, m) => {
    (acc[m.subject] ||= []).push(m);
    return acc;
  }, {});

  Object.values(marksBySubject).forEach((arr) =>
    arr.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
  );

  /* ========================================================= */

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{student.fullName}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Subjects: {student.subjects.join(", ")}
          </p>
        </div>

        <button
          onClick={() => setShowAddExam(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          + Add Exam
        </button>
      </div>

      {/* ================= MARKS BY EXAM ================= */}
      <section>
        <button
          onClick={() => toggleSection("exams")}
          className="w-full flex items-center justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Marks by Exam</h2>
          <FiChevronDown
            className={`transition-transform ${
              sections.exams ? "rotate-180" : ""
            }`}
          />
        </button>

        {sections.exams && (
          <div className="mt-3 space-y-3">
            {Object.entries(marksByExam).map(([exam, examMarks]) => {
              const isOpen = openExam === exam;

              const totalObtained = examMarks.reduce(
                (s, m) => s + m.marksObtained,
                0,
              );
              const totalMax = examMarks.reduce((s, m) => s + m.totalMarks, 0);
              const percentage =
                totalMax > 0
                  ? ((totalObtained / totalMax) * 100).toFixed(1)
                  : "0.0";

              return (
                <div key={exam} className="bg-gray-50 rounded-md px-4">
                  <button
                    onClick={() => setOpenExam(isOpen ? null : exam)}
                    className="w-full flex justify-between py-3"
                  >
                    <div className="font-medium">
                      {exam}
                      <span className="ml-2 text-sm text-gray-500">
                        ({percentage}%)
                      </span>
                    </div>

                    <FiChevronDown
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-3 space-y-1">
                      {examMarks.map((m) => (
                        <div
                          key={m._id}
                          className="flex justify-between text-sm"
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

      {/* ================= EXAM PERFORMANCE CHART ================= */}
      <section>
        <button
          onClick={() => toggleSection("examChart")}
          className="w-full flex items-center justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Exam Performance Overview</h2>
          <FiChevronDown
            className={`transition-transform ${
              sections.examChart ? "rotate-180" : ""
            }`}
          />
        </button>

        {sections.examChart && (
          <div className="mt-3 bg-gray-50 rounded-lg p-4">
            <ExamPerformanceChart marksByExam={marksByExam} />
          </div>
        )}
      </section>

      {/* ================= SUBJECT PROGRESS ================= */}
      <section>
        <button
          onClick={() => toggleSection("subjects")}
          className="w-full flex items-center justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Subject Progress</h2>
          <FiChevronDown
            className={`transition-transform ${
              sections.subjects ? "rotate-180" : ""
            }`}
          />
        </button>

        {sections.subjects && (
          <div className="mt-4 space-y-5">
            {Object.entries(marksBySubject).map(([subject, subjectMarks]) => {
              const isOpen = openSubjects[subject];

              // ✅ SORT CHRONOLOGICALLY
              const sortedMarks = [...subjectMarks].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );

              const percentages = sortedMarks.map(
                (m) => (m.marksObtained / m.totalMarks) * 100,
              );

              const avg =
                percentages.reduce((a, b) => a + b, 0) / percentages.length;

              let trend = 0;

              if (percentages.length >= 2) {
                const last = percentages[percentages.length - 1];
                const prev = percentages[percentages.length - 2];
                trend = last - prev;
              }

              const trendLabel =
                trend > 2 ? "Improving" : trend < -2 ? "Declining" : "Stable";

              return (
                <div key={subject} className="bg-gray-50 rounded-md px-4">
                  <button
                    onClick={() =>
                      setOpenSubjects((prev) => ({
                        ...prev,
                        [subject]: !prev[subject],
                      }))
                    }
                    className="w-full flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-medium">{subject}</div>
                      <div className="text-sm text-gray-500">
                        {trend > 2 && "↑ "}
                        {trend < -2 && "↓ "}
                        {trend >= -2 && trend <= 2 && "→ "}
                        {trendLabel} · Avg {avg.toFixed(0)}%
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-3 text-sm">
                      <div className="grid grid-cols-3 text-gray-500 mb-1">
                        <span>Exam</span>
                        <span>Marks</span>
                        <span>%</span>
                      </div>

                      {sortedMarks.map((m) => {
                        const pct = (m.marksObtained / m.totalMarks) * 100;

                        return (
                          <div key={m._id} className="grid grid-cols-3 py-1">
                            <span>{m.examName}</span>
                            <span>
                              {m.marksObtained}/{m.totalMarks}
                            </span>
                            <span>{pct.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= SUBJECT CHART ================= */}
      <section>
        <button
          onClick={() => toggleSection("subjectChart")}
          className="w-full flex items-center justify-between py-3"
        >
          <h2 className="text-lg font-semibold">Subject Progress Over Time</h2>
          <FiChevronDown
            className={`transition-transform ${
              sections.subjectChart ? "rotate-180" : ""
            }`}
          />
        </button>

        {sections.subjectChart && (
          <div className="mt-3 bg-gray-50 rounded-lg p-4">
            <SubjectProgressChart marks={marks} />
          </div>
        )}
      </section>

      {/* ================= ADD EXAM MODAL ================= */}
      {showAddExam && (
        <AddExamModal
          student={student}
          onClose={() => setShowAddExam(false)}
          onSaved={(newMarks: Mark[]) => {
            setMarks((prev) => [...prev, ...newMarks]);
            setShowAddExam(false);
          }}
        />
      )}
    </div>
  );
}
