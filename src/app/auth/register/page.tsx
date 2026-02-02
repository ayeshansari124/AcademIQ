"use client";

import { useAdminRegister } from "@/hooks/auth/useAdminRegister";
import Link from "next/link";

export default function RegisterPage() {
  const register = useAdminRegister();

  return (
    <div className="bg-slate-50 flex justify-center px-4 py-6">
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-xl
          px-6
          py-6
        "
      >
        {/* Header */}
        <h1 className="text-xl font-semibold text-slate-800">
          Create Admin Account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Register to manage your institute
        </p>

        {/* Form */}
        <form
          className="mt-5 space-y-4"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <input
            name="secretKey"
            type="password"
            placeholder="Admin Secret Key"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />

          <button
            className="
              w-full
              mt-2
              rounded-xl
              bg-blue-900
              py-2.5
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
        <p className="mt-4 text-sm text-slate-600 text-center">
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
