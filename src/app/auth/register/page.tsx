"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });
  const [loading, setLoading] = useState(false);
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.secretKey) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Registering institute...");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      toast.success("Admin account created");
      router.push("/admin/dashboard");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      {" "}
      <h1 className="text-3xl font-semibold text-center text-slate-800">
        {" "}
        Create Admin Account{" "}
      </h1>{" "}
      <p className="mt-1 text-center text-slate-500">
        {" "}
        Register yourself to manage your institute with AcademIQ{" "}
      </p>{" "}
      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        {" "}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />{" "}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />{" "}
        <Input
          label="Password"
          type="password"
          placeholder="Create a secure password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />{" "}
        <Input
          label="Admin Authorization Key"
          type="password"
          placeholder="Enter admin secret key"
          value={form.secretKey}
          onChange={(v) => setForm({ ...form, secretKey: v })}
        />{" "}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {" "}
          {loading ? "Registering..." : "Register"}{" "}
        </button>{" "}
      </form>{" "}
      <p className="mt-6 text-center text-sm text-slate-600">
        {" "}
        Already registered?{" "}
        <Link
          href="/auth/admin-login"
          className="font-semibold text-blue-600 hover:underline"
        >
          {" "}
          Sign in{" "}
        </Link>{" "}
      </p>{" "}
    </div>
  );
}
/* ---------- Reusable Input ---------- */ function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      {" "}
      <label className="text-sm font-medium text-slate-700">
        {" "}
        {label}{" "}
      </label>{" "}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      />{" "}
    </div>
  );
}
