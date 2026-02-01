"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFeeProfile } from "@/hooks/fee/useFeeProfile";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  studentId: string;
  viewerRole: "ADMIN" | "STUDENT";
};

export default function FeePage({ studentId, viewerRole }: Props) {
  const { data, loading, reload } = useFeeProfile(studentId);

  useEffect(() => {
    if (viewerRole !== "STUDENT") return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [viewerRole]);

  if (loading) return <p className="p-6">Loading fees…</p>;
  if (!data) return <p className="p-6">Failed to load fees</p>;

  const { student, currentFee, feeHistory } = data;

  return (
    <div className="space-y-6">
      {/* STUDENT INFO */}
      <div className=" rounded p-4 bg-white shadow-lg">
        <h2 className="text-xl font-bold text-blue-900">{student.fullName}</h2>
        <p className="text-sm text-gray-600">
          Class: {student.class?.name || "-"}
        </p>
        <p className="mt-2 font-medium text-slate-500">
          Monthly Fee: ₹{student.monthlyFee}
        </p>
      </div>

      {/* CURRENT FEE */}
      {currentFee && (
        <div className=" rounded p-4 bg-white shadow-lg">
          <p>
            Status:{" "}
            <b
              className={
                currentFee.status === "PAID"
                  ? "text-green-600"
                  : currentFee.status === "OVERDUE"
                    ? "text-red-600"
                    : "text-orange-600"
              }
            >
              {currentFee.status}
            </b>
          </p>

          <p className="mt-1">Amount: ₹{currentFee.amount}</p>

          {/* ADMIN CASH */}
          {viewerRole === "ADMIN" && currentFee.status !== "PAID" && (
            <button
              className="mt-4 px-4 py-2 bg-blue-900 text-white rounded cursor-pointer"
              onClick={async () => {
                const t = toast.loading("Marking fee as paid...");

                const res = await fetch("/api/admin/fees/mark-paid", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    feeRecordId: currentFee._id,
                  }),
                });

                toast.dismiss(t);

                if (!res.ok) {
                  toast.error("Failed to mark paid");
                  return;
                }

                toast.success("Fee marked as paid");
                reload();
              }}
            >
              Mark as Paid (Cash)
            </button>
          )}

          {/* STUDENT ONLINE */}
          {viewerRole === "STUDENT" && currentFee.status !== "PAID" && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
              onClick={async () => {
                try {
                  const res = await fetch("/api/student/fees/create-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      feeRecordId: currentFee._id,
                    }),
                  });

                  const order = await res.json();
                  if (!res.ok) throw new Error(order.error);

                  const rzp = new window.Razorpay({
                    key: order.key,
                    amount: order.amount,
                    currency: "INR",
                    name: "AcademIQ",
                    order_id: order.orderId,
                    handler: async (response: any) => {
                      const verify = await fetch(
                        "/api/student/fees/verify-payment",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...response,
                            feeRecordId: currentFee._id,
                          }),
                        },
                      );

                      if (verify.ok) {
                        toast.success("Payment successful");
                        reload();
                      } else {
                        toast.error("Payment verification failed");
                      }
                    },
                  });

                  rzp.open();
                } catch (err: any) {
                  toast.error(err.message || "Payment failed");
                }
              }}
            >
              Pay Now
            </button>
          )}
        </div>
      )}

      {/* FEE HISTORY */}
      <div className="rounded p-4 bg-white shadow-lg">
        <h3 className="mb-4 font-bold">Fee History</h3>

        {feeHistory.length === 0 ? (
          <p className="text-sm text-slate-500">No fee records found</p>
        ) : (
          <div className="space-y-6">
            {feeHistory.map((f) => (
              <div key={f._id} className="flex items-start justify-between">
                {/* LEFT */}
                <div>
                  <div className="text-sm text-slate-600">{f.date}</div>

                  <div className="mt-1 font-medium">₹{f.amount}</div>

                  <div
                    className={`mt-1 text-sm font-semibold ${
                      f.status === "PAID"
                        ? "text-green-600"
                        : f.status === "OVERDUE"
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {f.status}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-sm font-semibold text-slate-700">
                  {f.mode}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
