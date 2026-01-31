"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useSendNotification } from "@/hooks/notification/useSendNotification";

interface Props {
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function SendNotificationModal({
  onClose,
  onSuccess,  
}: Props) {

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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl p-5 m-4 space-y-4">
        <h2 className="text-lg font-bold text-blue-900">
          Send Notification
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
  disabled={!isValid || loading}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white
    transition
    ${
      !isValid || loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
>
  <FaPaperPlane className="h-4 w-4 -translate-y-px" />
  <span className="leading-none">
    {loading ? "Sending…" : "Send"}
  </span>
</button>

        </div>
      </div>
    </div>
  );
}
