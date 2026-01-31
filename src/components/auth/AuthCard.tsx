"use client";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-slate-500">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
