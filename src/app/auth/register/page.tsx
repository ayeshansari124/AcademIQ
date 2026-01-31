"use client";

import { useAdminRegister } from "@/hooks/auth/useAdminRegister";
import Link from "next/link";

export default function RegisterPage() {
  const register = useAdminRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          Create Admin Account
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Register yourself to manage your institute
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);

            register({
              name: form.get("name") as string,
              email: form.get("email") as string,
              password: form.get("password") as string,
              secretKey: form.get("secretKey") as string,
            });
          }}
        >
          <input
            name="name"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />

          <input
            name="secretKey"
            type="password"
            placeholder="Admin Secret Key"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />

          <button className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
