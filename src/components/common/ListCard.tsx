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
        group
        rounded-2xl
        border border-slate-200
        bg-white
        px-5 py-4
        shadow-sm
        transition-all duration-200

        ${
          onClick
            ? `
              cursor-pointer
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:shadow-md
            `
            : ""
        }
      `}
    >
      <p
        className="
          text-base
          font-semibold
          tracking-tight
          text-slate-900
        "
      >
        {title}
      </p>

      {subtitle &&
        (Array.isArray(subtitle) ? subtitle : [subtitle]).map((line, i) => (
          <p
            key={i}
            className="
              mt-1
              text-sm
              leading-6
              text-slate-600
            "
          >
            {line}
          </p>
        ))}
    </div>
  );
}
