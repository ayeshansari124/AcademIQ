"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import FormInput from "@/components/ui/FormInput";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddStudentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (creds: { username: string; password: string }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    parentName: "",
    phone: "",
    classId: "",
    subjects: "",
    monthlyFees: "",
  });

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.parentName ||
      !form.phone ||
      !form.classId ||
      !form.subjects ||
      !days.length ||
      !form.monthlyFees
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating student...");

    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()),
        days,
        monthlyFees: Number(form.monthlyFees),
      }),
    });

    const data = await res.json();
    toast.dismiss(t);
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to create student");
      return;
    }

    toast.success("Student created");
    onSuccess(data.credentials);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Add Student
            </h2>
            <X
              className="h-5 w-5 cursor-pointer"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Student Full Name" value={form.fullName}
              onChange={(v) => setForm({ ...form, fullName: v })} />

            <FormInput label="Parent Name" value={form.parentName}
              onChange={(v) => setForm({ ...form, parentName: v })} />

            <FormInput label="Phone Number" value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })} />

            <FormInput label="Class / Batch" value={form.classId}
              onChange={(v) => setForm({ ...form, classId: v })} />

            <FormInput label="Subjects (comma separated)" value={form.subjects}
              onChange={(v) => setForm({ ...form, subjects: v })} />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Days Attending
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-md border px-3 py-1 text-sm ${
                      days.includes(day)
                        ? "bg-blue-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <FormInput
              label="Monthly Fees (₹)"
              type="number"
              value={form.monthlyFees}
              onChange={(v) => setForm({ ...form, monthlyFees: v })}
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
