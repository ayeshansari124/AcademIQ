"use client";

import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CredentialsModal({
  credentials,
  onClose,
}: {
  credentials: { username: string; password: string };
  onClose: () => void;
}) {
  const combinedText = `Username: ${credentials.username}
Password: ${credentials.password}`;

  function copyAll() {
    navigator.clipboard.writeText(combinedText);
    toast.success("Credentials copied");
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold">
            Student Credentials
          </h2>

          <div className="relative rounded-lg border bg-slate-50 p-4 font-mono text-sm whitespace-pre-line">
            {combinedText}

            <button
              onClick={copyAll}
              className="absolute right-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            >
                <Copy className="inline-block h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Save these students credentials. They won’t be shown again.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
