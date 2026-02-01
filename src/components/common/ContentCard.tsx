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
    <div className="rounded-lg bg-white p-4 shadow-lg">
      {title && (
        <h2 className="font-semibold text-sm text-slate-900">
          {title}
        </h2>
      )}

      <p className="text-sm text-slate-700 mt-1 leading-relaxed">
        {content}
      </p>

      {(metaLeft || metaRight) && (
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>{metaLeft}</span>
          <span>{metaRight}</span>
        </div>
      )}
    </div>
  );
}
