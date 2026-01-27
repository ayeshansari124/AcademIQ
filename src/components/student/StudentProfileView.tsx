"use client";

import { Trash2 } from "lucide-react";

export default function StudentProfileView({
  student,
  showDelete = false,
  onDelete,
  title = "Student Profile",
}: {
  student: any;
  showDelete?: boolean;
  onDelete?: () => void;
  title?: string;
}) {
  const joinedDate = new Date(student.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-blue-900">
            {student.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {title}
          </p>
        </div>

        {showDelete && (
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
            title="Delete student"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <InfoGrid>
          <Info label="Student Name" value={student.fullName} />
          <Info label="Parent Name" value={student.parentName} />
          <Info label="Phone Number" value={student.phone} />
          <Info label="Username" value={student.userId?.username} mono />
        </InfoGrid>
      </Section>

      {/* ACADEMIC INFO */}
      <Section title="Academic Information">
        <InfoGrid>
          <Info label="Class / Batch" value={student.class?.name} />
          <Info label="Subjects" value={student.subjects?.join(", ")} />
          <Info label="Days Attending" value={student.days?.join(", ")} />
        </InfoGrid>
      </Section>

      {/* FEES INFO */}
      <Section title="Fee Information">
        <InfoGrid>
          <Info label="Monthly Fees" value={`₹${student.monthlyFee}`} />
          <Info label="Admission Date" value={joinedDate} />
        </InfoGrid>
      </Section>
    </div>
  );
}

/* ---------- SMALL UI HELPERS ---------- */

function Section({ title, children }: any) {
  return (
    <section className="rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoGrid({ children }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-slate-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
