import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
        {/* Brand */}
        <h1 className="text-3xl font-semibold text-slate-800">
          Academ<span className="text-blue-600">IQ</span>
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Smart academic management, made simple.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/register"
            className="block w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Continue as Teacher
          </Link>

          <Link
            href="/auth/student-login"
            className="block w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Continue as Student
          </Link>
        </div>
      </div>
    </div>
  );
}
