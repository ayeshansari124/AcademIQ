"use client";

import { useAdminRegister } from "@/hooks/auth/useAdminRegister";
import Link from "next/link";

export default function RegisterPage() {
  const register = useAdminRegister();

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-10">
      <div
        className="
          w-full
          max-w-xl sm:max-w-2xl lg:max-w-3xl
          bg-white
          rounded-2xl
          shadow-xl
          px-6 sm:px-10 lg:px-14
          py-8 sm:py-10
        "
      >
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Create Admin Account
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Register yourself to manage your institute
        </p>

        {/* Form */}
        <form
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
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
            className="col-span-1 sm:col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="secretKey"
            type="password"
            placeholder="Admin Secret Key"
            className="col-span-1 sm:col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <button
            className="
              col-span-1 sm:col-span-2
              mt-4
              rounded-xl
              bg-blue-900
              py-3.5
              text-base
              font-semibold
              text-white
              hover:bg-blue-800
              transition
            "
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm sm:text-base text-slate-600">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
