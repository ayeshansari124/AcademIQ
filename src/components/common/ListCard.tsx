"use client";

interface Props {
  title: string;
  subtitle?: string | string[];
  onClick?: () => void;
}

export default function ListCard({ title, subtitle, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl bg-white px-4 py-4
        shadow-lg
        transition
        ${onClick ? "cursor-pointer hover:bg-slate-50 hover:shadow-md" : ""}
      `}
    >
      <p className="font-semibold text-lg text-black">{title}</p>

      {subtitle &&
        (Array.isArray(subtitle) ? subtitle : [subtitle]).map((line, i) => (
          <p key={i} className="mt-0.5 text-sm text-slate-800">
            {line}
          </p>
        ))}
    </div>
  );
}
