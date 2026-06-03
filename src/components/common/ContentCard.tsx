"use client";

interface Props {
  title?: string;
  content: string;
  metaLeft?: string;
  metaRight?: string;
}

export default function ContentCard({
  title,
  content,
  metaLeft,
  metaRight,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        hover:shadow-md
      "
    >
      {title && (
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      )}

      <p className="mt-2 text-sm leading-7 text-slate-600">{content}</p>

      {(metaLeft || metaRight) && (
        <div
          className="
            mt-4
            flex items-center justify-between
            border-t border-slate-100
            pt-3
            text-xs
            text-slate-500
          "
        >
          <span>{metaLeft}</span>
          <span>{metaRight}</span>
        </div>
      )}
    </div>
  );
}
