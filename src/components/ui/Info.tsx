export default function Info({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-s text-slate-500">{label}</p>
      <p
        className={`mt-1 text-s font-medium ${
          mono ? "font-mono" : ""
        } ${highlight ? "text-green-600" : "text-slate-900"}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}