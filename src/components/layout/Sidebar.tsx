"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SidebarConfig } from "@/types/sidebar";

interface Props {
  open: boolean;
  onClose: () => void;
  config: SidebarConfig;
}

export default function Sidebar({ open, onClose, config }: Props) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72
        bg-blue-900/90 backdrop-blur-md text-white
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{config.title}</h2>
            <span className="text-xs text-white/70">
              {config.subtitle}
            </span>
          </div>
          <X
            className="h-6 w-6 cursor-pointer hover:text-white/80"
            onClick={onClose}
          />
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {config.items.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm transition
                ${
                  isActive
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-blue-900" : ""
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
