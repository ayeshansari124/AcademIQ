import Info from "@/components/ui/Info";
import Section from "@/components/ui/Section";

export default function OverviewTab({ student }: { student: any }) {
  return (
    <div className="space-y-10">
      <Section title="Personal Information">
        <InfoGrid>
            <Info label="Student Name" value={student.fullName} />
            <Info label="Parent Name" value={student.parentName} />
            <Info label="Phone Number" value={student.phone} />
            <Info label="Username" value={student.userId?.username} mono />
          </InfoGrid>
      </Section>

      <Section title="Academic Information">
          <InfoGrid>
            <Info 
            label="Class / Batch" value={student.classId} />
            <Info label="Subjects" value={student.subjects?.join(", ")} />
            <Info label="Days Attending" value={student.days?.join(", ")} />
          </InfoGrid>
      </Section>

      <Section title="Fee Information">
          <InfoGrid>
            <Info label="Monthly Fees" value={`₹${student.monthlyFees}`} />
            <Info
              label="Admission Date"
              value={new Date(student.createdAt).toLocaleDateString()}
            />
          </InfoGrid>
      </Section>
    </div>
  );
}

//helpers
function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
      {children}
    </div>
  );
}


