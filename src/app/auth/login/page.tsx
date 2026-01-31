"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";

export default function LoginPage() {
  const login = useAuthLogin();

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
