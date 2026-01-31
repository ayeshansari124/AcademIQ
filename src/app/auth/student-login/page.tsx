"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";

export default function StudentLoginPage() {
  const login = useAuthLogin({
    expectedRole: "STUDENT",
    redirectTo: "/student/dashboard",
    loadingText: "Signing in as student...",
  });

  return (
    <AuthCard title="Welcome back" subtitle="Login to continue">
      <AuthForm
        submitText="Login"
        fields={[
          { name: "identifier", placeholder: "Username / Email" },
          { name: "password", type: "password", placeholder: "Password" },
        ]}
        onSubmit={login}
      />
    </AuthCard>
  );
}
