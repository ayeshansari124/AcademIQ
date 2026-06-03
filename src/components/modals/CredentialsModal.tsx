"use client";

import { useState } from "react";
import { Copy, Check, X, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CredentialsModal({
  credentials,
  onClose,
}: {
  credentials: {
    username: string;
    password: string;
  };
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const combinedText = `Username: ${credentials.username}
Password: ${credentials.password}`;

  function copyAll() {
    navigator.clipboard.writeText(combinedText);

    setCopied(true);

    toast.success("Credentials copied successfully");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            max-w-xl
            bg-white
            rounded-3xl
            shadow-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}
          <header className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Student Credentials
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Save these login details before closing.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </header>

          {/* BODY */}
          <div className="px-6 py-6">
            <div
              className="
                relative
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-5
              "
            >
              <button
                onClick={copyAll}
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  items-center
                  justify-center
                  h-10
                  w-10
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                  hover:bg-slate-100
                  transition
                "
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-slate-700" />
                )}
              </button>

              <div className="space-y-5 pr-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Username
                  </p>

                  <div className="font-mono text-lg font-semibold text-slate-900 break-all">
                    {credentials.username}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Password
                  </p>

                  <div className="font-mono text-lg font-semibold text-slate-900 break-all">
                    {credentials.password}
                  </div>
                </div>
              </div>
            </div>

            {/* WARNING */}
            <div
              className="
                mt-5
                flex
                gap-3
                rounded-2xl
                border
                border-amber-200
                bg-amber-50
                p-4
              "
            >
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Important
                </p>

                <p className="text-sm text-amber-700 mt-1">
                  These credentials will only be shown once. Make sure you copy
                  or save them before closing this window.
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="border-t px-6 py-4 flex justify-end gap-3">
            <button
              onClick={copyAll}
              className="
                rounded-xl
                border
                border-slate-300
                px-5
                py-2.5
                font-medium
                hover:bg-slate-50
              "
            >
              Copy Credentials
            </button>

            <button
              onClick={onClose}
              className="
                rounded-xl
                bg-blue-900
                px-5
                py-2.5
                font-medium
                text-white
                hover:bg-blue-800
              "
            >
              Done
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
