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
    <div
      className="
        max-w-4xl
        mx-auto
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        space-y-8 sm:space-y-10
      "
    >
      {/* Header */}
      <header
        className="
          flex items-start sm:items-center justify-between
          rounded-2xl
          bg-white
          px-5 sm:px-6
          py-5 sm:py-6
          shadow-sm
        "
      >
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
            {student.fullName}
          </h1>
          <p className="mt-1 text-base sm:text-lg text-slate-500">
            {title}
          </p>
        </div>

        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            className="
              rounded-xl
              p-2.5
              text-red-600
              hover:bg-red-50
              transition cursor-pointer
            "
          >
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </header>

      <Section title="Personal Information">
        <Info label="Student Name" value={student.fullName} />
        <Info label="Parent Name" value={student.parentName} />
        <Info label="Phone Number" value={student.phone} />
        <Info
          label="Username"
          value={student.userId?.username}
          mono
        />
      </Section>

      <Section title="Academic Information">
        <Info label="Class / Batch" value={student.class?.name} />
        <Info
          label="Subjects"
          value={student.subjects?.join(", ")}
        />
        <Info
          label="Days Attending"
          value={student.days?.join(", ")}
        />
      </Section>

      <Section title="Fee Information">
        <Info
          label="Monthly Fees"
          value={`₹${student.monthlyFee}`}
        />
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
    <section
      className="
        rounded-2xl
        bg-white
        px-5 sm:px-6
        py-6 sm:py-7
        shadow-sm
        space-y-5
      "
    >
      <h2
        className="
          text-base sm:text-lg
          font-semibold
          uppercase
          tracking-wide
          text-blue-900
        "
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {children}
      </div>
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
    <div className="space-y-1">
      <p className="text-sm sm:text-base text-slate-500">
        {label}
      </p>
      <p
        className={`text-base sm:text-lg font-medium ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
