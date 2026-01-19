export default function StudentFeesPage() {
  const fees = {
    monthly: 2500,
    paid: true,
    lastPaidOn: "12 Aug 2025",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-blue-900">
        Fees
      </h1>

      <div className="rounded-lg border bg-white p-5 space-y-3">
        <Row label="Monthly Fees" value={`₹${fees.monthly}`} />
        <Row
          label="Status"
          value={fees.paid ? "Paid" : "Pending"}
        />
        <Row label="Last Paid On" value={fees.lastPaidOn} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
