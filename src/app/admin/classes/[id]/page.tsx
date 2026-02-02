"use client";

import { useParams, useRouter } from "next/navigation";
import { useClass } from "@/hooks/class/useClass";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ClassProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { cls, loading } = useClass(id || "");

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this class?")) return;

    const t = toast.loading("Deleting class...");

    try {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Class deleted");
      router.push("/admin/classes");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      toast.dismiss(t);
    }
  }

  if (loading)
    return (
      <p className="p-6 text-base sm:text-lg text-slate-500">
        Loading…
      </p>
    );

  if (!cls)
    return (
      <p className="p-6 text-base sm:text-lg">
        Not found
      </p>
    );

  return (
    <div className="p-6 max-w-4xl space-y-8 mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900">
            {cls.name}
          </h1>
          <p className="mt-1 text-base sm:text-lg text-slate-500">
            Class Overview
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
          title="Delete class"
        >
          <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* SUBJECTS */}
      <Section title="Subjects">
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          {cls.subjects.join(", ")}
        </p>
      </Section>

      {/* STUDENTS */}
      <Section title="Students">
        {cls.students?.length === 0 ? (
          <p className="text-base sm:text-lg text-slate-500">
            No students enrolled in this class
          </p>
        ) : (
          <ul className="space-y-3">
            {cls.students?.map((s) => (
              <li
                key={s._id}
                className="rounded-lg px-3 py-2 text-base sm:text-lg hover:bg-slate-50"
              >
                {s.fullName}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-base sm:text-lg font-semibold uppercase tracking-wide text-blue-900">
        {title}
      </h2>
      {children}
    </div>
  );
}
