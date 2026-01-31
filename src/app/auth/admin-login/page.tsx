"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import {useAuthLogin} from "@/hooks/useAuthLogin"

export default function AdminLoginPage() {
  const login = useAuthLogin({
    expectedRole: "ADMIN",
    redirectTo: "/admin/dashboard",
    loadingText: "Signing in as admin...",
  });

  return (
    <AuthCard title="Welcome back" subtitle="Login to continue">
      <AuthForm
        submitText="Login"
        fields={[
          { name: "identifier", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
        ]}
        onSubmit={login}
      />
    </AuthCard>
  );
}
