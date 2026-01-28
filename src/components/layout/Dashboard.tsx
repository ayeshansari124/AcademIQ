import Link from "next/link";
import { DashboardTile } from "@/types/dashboard";

interface DashboardGridProps {
  title: string;
  tiles: DashboardTile[];
}

export default function DashboardGrid({
  title,
  tiles,
}: DashboardGridProps) {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
          {title}
        </h2>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-14 gap-x-10">
          {tiles.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center gap-3 group"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-xl
                ${item.color} transition group-hover:scale-105`}
              >
                <item.icon className="h-8 w-8 text-white" />
              </div>

              <p className="text-sm font-medium text-slate-800 text-center">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
