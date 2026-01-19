"use client";

import { Menu, Power } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    const t = toast.loading("Logging out...");

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    toast.dismiss(t);
    toast.success("Logged out");

    // 🔥 hard redirect so middleware re-runs
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between bg-blue-800 px-6 py-4 text-white">
      {/* Menu */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="text-sm font-medium">Menu</span>
      </div>

      {/* Brand */}
      <h1 className="text-lg font-semibold tracking-wide">
        AcademIQ
      </h1>

      {/* Logout */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleLogout}
      >
        <Power className="h-5 w-5" />
        <span className="text-sm">Logout</span>
      </div>
    </header>
  );
}
