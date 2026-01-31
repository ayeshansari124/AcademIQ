"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { useAdminRegister } from "@/hooks/useAdminRegister";
import Link from "next/link";

export default function RegisterPage() {
  const register = useAdminRegister();

  return (
    <AuthCard
      title="Create Admin Account"
      subtitle="Register yourself to manage your institute"
    >
      <AuthForm
        submitText="Register"
        fields={[
          { name: "name", placeholder: "Full Name" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "secretKey", type: "password", placeholder: "Admin Secret Key" },
        ]}
        onSubmit={register}
      />

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
