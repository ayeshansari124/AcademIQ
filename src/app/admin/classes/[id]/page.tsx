"use client";

import { useParams, useRouter } from "next/navigation";
import { useClass } from "@/hooks/useClass";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ClassProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { cls, loading } = useClass(id as string);

  async function handleDelete() {
    if (!confirm("Delete this class?")) return;

    const res = await fetch(`/api/admin/classes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error);
      return;
    }

    toast.success("Class deleted");
    router.push("/admin/classes");
  }

  if (loading) return <p className="p-6 text-slate-500">Loading…</p>;
  if (!cls) return <p className="p-6">Not found</p>;

  return (
    <div className="p-6 max-w-4xl space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{cls.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Class Overview</p>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          title="Delete class"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* SUBJECTS */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Subjects
        </h2>
        <p className="text-sm text-slate-700">{cls.subjects.join(", ")}</p>
      </div>

      {/* STUDENTS */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Students
        </h2>

        {cls.students?.length === 0 ? (
          <p className="text-sm text-slate-500">
            No students enrolled in this class
          </p>
        ) : (
          <ul className="space-y-2">
            {cls.students?.map((s) => (
              <li
                key={s._id}
                className="rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                {s.fullName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
