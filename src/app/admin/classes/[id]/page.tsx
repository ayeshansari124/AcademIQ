"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ClassProfilePage() {
  const { id } = useParams();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleDelete() {
  const confirmed = confirm(
    "Are you sure you want to delete this class? This action cannot be undone."
  );

  if (!confirmed) return;

  const res = await fetch(`/api/admin/classes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.error || "Failed to delete class");
    return;
  }

  toast.success("Class deleted");
  router.push("/admin/classes");
}

  useEffect(() => {
    fetch(`/api/admin/classes/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCls(data.class))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!cls) return <div className="p-6">Class not found</div>;

  return (
    <div className="p-6">
      {/* Header */}
      
      <div className="mb-6 flex items-center justify-between rounded-xl p-4 shadow-lg">
  <h1 className="text-xl font-bold text-blue-600">
    {cls.name}
  </h1>

  <button
    onClick={handleDelete}
    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
    title="Delete class"
  >
    <Trash2 size={18} />
  </button>
</div>

       
       {/* Subjects */}       
 <div className="rounded-xl  p-4 shadow-lg">
        <h2 className=" font-bold text-xl text-blue-600">Subjects:<p className="mt-2  text-sm text-slate-500">
            {cls.subjects.join(", ")}
          </p> </h2>
        </div>
      {/* Info */}
      <div className="rounded-xl  p-6 shadow-lg">
        <h2 className="mb-4 font-bold text-xl text-blue-600">Students</h2>

        {cls.students.length === 0 && (
          <p className="text-sm text-slate-500">
            No students enrolled
          </p>
        )}

        <ul className="space-y-2">
          {cls.students.map((s: any) => (
            <li
              key={s._id}
              className="rounded-lg border px-4 py-2"
            >
              {s.fullName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
