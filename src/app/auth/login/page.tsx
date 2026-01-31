"use client";

import { useAuthLogin } from "@/hooks/auth/useAuthLogin";

export default function LoginPage() {
  const login = useAuthLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Login to continue
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            login({
              identifier: form.get("identifier") as string,
              password: form.get("password") as string,
            });
          }}
        >
          <input
            name="identifier"
            placeholder="Username / Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />

          <button className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
