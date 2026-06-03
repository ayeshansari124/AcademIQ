"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";

import { useSendNotification } from "@/hooks/notification/useSendNotification";

interface Props {
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function SendNotificationModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const isValid = title.trim().length > 0 && message.trim().length > 0;

  const { send, loading } = useSendNotification(async () => {
    await onSuccess();
  });

  function handleSend() {
    if (!isValid) return;

    send({
      title,
      message,
      scope: "ALL",
    });
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
            max-w-2xl
            bg-white
            rounded-3xl
            shadow-2xl
            max-h-[90vh]
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-5 border-b shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Send Notification
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Broadcast a notification to all students and staff.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </header>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notification Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notification Message
              </label>

              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification here..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  resize-none
                  outline-none
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>
          </div>

          {/* FOOTER */}
          <footer className="border-t px-6 py-4 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
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
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={!isValid || loading}
              className={`
                flex items-center gap-2
                rounded-xl
                px-5 py-2.5
                text-white
                font-medium
                transition
                ${
                  !isValid || loading
                    ? "bg-blue-700 opacity-60 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }
              `}
            >
              <FaPaperPlane size={14} />
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
