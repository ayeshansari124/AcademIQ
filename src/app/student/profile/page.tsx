export default function StudentProfilePage() {
  const student = {
    name: "Ayesha Khan",
    class: "10-A",
    phone: "9876543210",
    parent: "Mr. Khan",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Profile
      </h1>

      <div className="rounded-lg border bg-white p-5 space-y-3">
        <ProfileRow label="Name" value={student.name} />
        <ProfileRow label="Class" value={student.class} />
        <ProfileRow label="Parent Name" value={student.parent} />
        <ProfileRow label="Phone" value={student.phone} />
      </div>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
