import Link from "next/link";
import { DashboardTile } from "@/types/dashboard";

interface DashboardGridProps {
  title: string;
  tiles: DashboardTile[];
}

export default function DashboardGrid({ title, tiles }: DashboardGridProps) {
  return (
    <main className="flex-1 px-6 py-12">
      {/* Header */}
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
          {title}
        </h2>

        <p className="mt-4 text-slate-500 text-lg">
          Manage your institution from one central dashboard
        </p>
      </div>

      {/* Dashboard Tiles */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-12">
          {tiles.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center group"
            >
              <div
                className={`
                  flex h-24 w-24 items-center justify-center
                  rounded-3xl shadow-md
                  ${item.color}
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:shadow-xl
                `}
              >
                <item.icon className="h-10 w-10 text-white" />
              </div>

              <p className="mt-4 text-base md:text-lg font-semibold text-slate-800 text-center transition-colors group-hover:text-blue-900">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
