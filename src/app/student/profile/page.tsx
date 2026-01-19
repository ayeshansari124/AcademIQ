"use client";

import { useEffect, useState } from "react";
import Info from "@/components/ui/Info";
import Section from "@/components/ui/Section";
import InfoGrid from "@/components/ui/InfoGrid";

export default function StudentProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudent(data.student))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="p-8 text-slate-500">
        Loading profile...
      </p>
    );
  }

  if (!student) {
    return (
      <p className="p-8 text-red-500">
        Profile not found
      </p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold text-blue-900 text-center">
        Your Profile
      </h1>

      {/* Personal Information */}
      <Section title="Personal Information">
        <InfoGrid>
          <Info
            label="Student Name"
            value={student.fullName}
          />
          <Info
            label="Parent Name"
            value={student.parentName}
          />
          <Info
            label="Phone Number"
            value={student.phone}
          />
        </InfoGrid>
      </Section>

      {/* Academic Information */}
      <Section title="Academic Information">
        <InfoGrid>
          <Info
            label="Class / Batch"
            value={student.classId}
          />
          <Info
            label="Subjects"
            value={student.subjects?.join(", ")}
          />
          <Info
            label="Days Attending"
            value={student.days?.join(", ")}
          />
        </InfoGrid>
      </Section>

      {/* Fee Information */}
      <Section title="Fee Information">
        <InfoGrid>
          <Info
            label="Monthly Fees"
            value={`₹${student.monthlyFees}`}
          />
          <Info
            label="Joined On"
            value={new Date(
              student.createdAt
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
        </InfoGrid>
      </Section>
    </div>
  );
}
