"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function StudentLoginPage() {
    const { setUser } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const t = toast.loading("Signing in...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier: username, password }),
    });
    const data = await res.json();
    toast.dismiss(t);
    if (!res.ok) return toast.error(data.error);
    if (data.user.role !== "STUDENT")
      return toast.error("This login is for students only");
    toast.success("Login successful");
    setUser(data.user);
    router.push("/student/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      {" "}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {" "}
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          {" "}
          Welcome back{" "}
        </h1>{" "}
        <p className="mt-1 text-center text-sm text-slate-500">
          {" "}
          Login to continue{" "}
        </p>{" "}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {" "}
          <input
            placeholder="Username"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            onChange={(e) => setUsername(e.target.value)}
          />{" "}
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <button className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            {" "}
            Login{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
