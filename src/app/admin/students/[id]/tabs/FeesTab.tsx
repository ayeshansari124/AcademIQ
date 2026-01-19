export default function FeesTab({ student }: { student: any }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700">
        Fees
      </h3>
      <p className="text-slate-500">
        Monthly Fees: ₹{student.monthlyFees}
      </p>
    </div>
  );
}
