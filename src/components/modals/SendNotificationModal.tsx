"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

export default function SendNotificationModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function handleSend() {
    if (!title || !message) {
      toast.error("Title and message required");
      return;
    }

    const t = toast.loading("Sending...");

    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, message }),
    });

    toast.dismiss(t);

    if (!res.ok) {
      toast.error("Failed to send");
      return;
    }

    toast.success("Notification sent 🚀");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl p-5 m-4 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          📣 Send Notification
        </h2>

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FaPaperPlane />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
