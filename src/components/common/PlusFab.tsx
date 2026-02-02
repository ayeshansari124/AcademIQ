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
        shrink-0
        h-12 w-12 sm:h-14 sm:w-14
        rounded-full
        bg-blue-900 text-white
        flex items-center justify-center
        shadow-md hover:shadow-lg
        hover:bg-blue-800
        transition cursor-pointer
      "
    >
      <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
    </button>
  );
}
