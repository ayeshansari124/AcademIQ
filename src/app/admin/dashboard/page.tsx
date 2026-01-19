import Link from "next/link";
import {
  ClipboardCheck,Users, BookOpen,IndianRupee,BarChart3
} from "lucide-react";

export default async function AdminDashboard() {
 const tiles = [
  {
    title: "Students",
    icon: Users,
    color: "bg-blue-500",
    href: "/admin/students",
  },
  {
    title: "Classes",
    icon: BookOpen,
    color: "bg-green-500",
    href: "/admin/classes",
  },
  {
    title: "Attendance",
    icon: ClipboardCheck,
    color: "bg-indigo-500",
    href: "/admin/attendance",
  },
  {
    title: "Marks",
    icon: BarChart3,
    color: "bg-yellow-500",
    href: "/admin/marks",
  },
  {
    title: "Fees",
    icon: IndianRupee,
    color: "bg-emerald-500",
    href: "/admin/fees",
  },
  {
    title: "Reports",
    icon: BarChart3,
    color: "bg-red-500",
    href: "/admin/reports",
  },
];


  return (
    <div>        
      <main className="flex-1 px-6 py-12">
        
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
            Admin Dashboard
          </h2>
        </div>

        {/* 🔹 Tiles */}
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-14 gap-x-10">
            {tiles.map((item) => (
  <Link
    key={item.title}
    href={item.href}
    className="flex flex-col items-center gap-3 cursor-pointer group"
  >
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-xl ${item.color} transition group-hover:scale-105`}
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
    </div>
  );
}
