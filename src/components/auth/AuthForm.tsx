"use client";

type Field = {
  name: string;
  type?: string;
  placeholder?: string;
};

export default function AuthForm({
  fields,
  onSubmit,
  submitText,
  loading,
}: {
  fields: Field[];
  onSubmit: (form: Record<string, string>) => void;
  submitText: string;
  loading?: boolean;
}) {
  const form: Record<string, string> = {};

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {fields.map((f) => (
        <input
          key={f.name}
          type={f.type ?? "text"}
          placeholder={f.placeholder}
          onChange={(e) => (form[f.name] = e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      ))}

      <button
        disabled={loading}
        className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Please wait..." : submitText}
      </button>
    </form>
  );
}
