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
        fixed
        bottom-6
        right-6
        z-50

        flex items-center justify-center

        h-14 w-14
        rounded-full

        bg-blue-600
        text-white

        shadow-lg
        shadow-blue-200/60

        transition-all duration-200

        hover:scale-105
        hover:bg-blue-700

        active:scale-95
      "
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
