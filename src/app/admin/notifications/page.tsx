"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import SendNotificationModal from "@/components/modals/SendNotificationModal";

export default function AdminNotificationsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Notifications
        </h1>

        {/* SMALL + BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center
                     rounded-full bg-blue-600 text-white
                     hover:bg-blue-700"
          title="Send notification"
        >
          <FaPlus />
        </button>
      </div>

      <p className="text-slate-500">
        Broadcast messages to all students.
      </p>

      {open && <SendNotificationModal onClose={() => setOpen(false)} />}


      {/* here */}
    </div>
  );
}
