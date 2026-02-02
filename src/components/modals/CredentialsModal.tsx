"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function CredentialsModal({
  credentials,
  onClose,
}: {
  credentials: { username: string; password: string };
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const combinedText = `Username: ${credentials.username}
Password: ${credentials.password}`;

  function copyAll() {
    navigator.clipboard.writeText(combinedText);
    setCopied(true);
    toast.success("Credentials copied");

    // revert icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-lg font-semibold">Student Credentials</h2>
          </header>

          {/* Body */}
          <div className="px-5 py-4">
            <div className="relative rounded-lg border bg-slate-50 p-4 font-mono text-sm whitespace-pre-line">
              {combinedText}

              <button
                onClick={copyAll}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-900 transition"
                aria-label="Copy credentials"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Save these credentials now. They won’t be shown again.
            </p>
          </div>

          {/* Footer */}
          <footer className="flex justify-end border-t px-5 py-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
            >
              Done
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
