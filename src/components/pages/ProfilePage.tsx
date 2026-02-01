"use client";

import { Trash2 } from "lucide-react";

export default function ProfilePage({
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
      <header className="flex justify-between rounded-xl px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-blue-900">
            {student.fullName}
          </h1>
          <p className="text-sm text-slate-500">{title}</p>
        </div>

        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        )}
      </header>

      <Section title="Personal Information">
        <Info label="Student Name" value={student.fullName} />
        <Info label="Parent Name" value={student.parentName} />
        <Info label="Phone Number" value={student.phone} />
        <Info label="Username" value={student.userId?.username} mono />
      </Section>

      <Section title="Academic Information">
        <Info label="Class / Batch" value={student.class?.name} />
        <Info label="Subjects" value={student.subjects?.join(", ")} />
        <Info label="Days Attending" value={student.days?.join(", ")} />
      </Section>

      <Section title="Fee Information">
        <Info label="Monthly Fees" value={`₹${student.monthlyFee}`} />
        <Info label="Admission Date" value={joinedDate} />
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
    <section className="rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text- font-semibold uppercase text-blue-900">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value || "-"}
      </p>
    </div>
  );
}
