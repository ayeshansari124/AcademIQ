"use client";

import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
  label?: string;
}

export default function PlusFab({ onClick, label }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label ?? "Add"}
      className="
        flex items-center justify-center
        h-12 w-12
        rounded-full

        bg-blue-800
        text-white

        shadow-lg
        shadow-blue-200/60

        transition-all duration-200

        hover:scale-105
        hover:bg-blue-900

        active:scale-95
      "
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}
