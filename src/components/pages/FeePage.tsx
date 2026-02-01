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

export default function FeePage({
  studentId,
  viewerRole,
}: Props) {
  const { data, loading, reload } =
    useFeeProfile(studentId);

  useEffect(() => {
    if (viewerRole !== "STUDENT") return;

    const script = document.createElement("script");
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";
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
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold">
          {student.fullName}
        </h2>
        <p className="text-sm text-gray-600">
          Class: {student.class?.name || "-"}
        </p>
        <p className="mt-2 font-medium">
          Monthly Fee: ₹{student.monthlyFee}
        </p>
      </div>

      {/* CURRENT FEE */}
      {currentFee && (
        <div className="border rounded p-4 bg-white">
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

          <p className="mt-1">
            Amount: ₹{currentFee.amount}
          </p>

          {/* ADMIN CASH */}
          {viewerRole === "ADMIN" &&
            currentFee.status !== "PAID" && (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                onClick={async () => {
                  const t = toast.loading(
                    "Marking fee as paid..."
                  );

                  const res = await fetch(
                    "/api/admin/fees/mark-paid",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        feeRecordId: currentFee._id,
                      }),
                    }
                  );

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
          {viewerRole === "STUDENT" &&
            currentFee.status !== "PAID" && (
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      "/api/student/fees/create-order",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          feeRecordId: currentFee._id,
                        }),
                      }
                    );

                    const order = await res.json();
                    if (!res.ok)
                      throw new Error(order.error);

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
                              "Content-Type":
                                "application/json",
                            },
                            body: JSON.stringify({
                              ...response,
                              feeRecordId: currentFee._id,
                            }),
                          }
                        );

                        if (verify.ok) {
                          toast.success(
                            "Payment successful"
                          );
                          reload();
                        } else {
                          toast.error(
                            "Payment verification failed"
                          );
                        }
                      },
                    });

                    rzp.open();
                  } catch (err: any) {
                    toast.error(
                      err.message || "Payment failed"
                    );
                  }
                }}
              >
                Pay Now
              </button>
            )}
        </div>
      )}

      {/* FEE HISTORY */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">
          Fee History
        </h3>

        <table className="w-full text-sm border">
  <thead>
    <tr className="border-b bg-slate-50">
      <th className="p-2 text-left">Date</th>
      <th className="p-2 text-left">Amount</th>
      <th className="p-2 text-left">Status</th>
      <th className="p-2 text-left">Mode</th>
    </tr>
  </thead>

  <tbody>
    {feeHistory.map(f => (
      <tr key={f._id} className="border-b">
        <td className="p-2">{f.date}</td>

        <td className="p-2">₹{f.amount}</td>

        <td
          className={`p-2 font-medium ${
            f.status === "PAID"
              ? "text-green-600"
              : f.status === "OVERDUE"
              ? "text-red-600"
              : "text-orange-600"
          }`}
        >
          {f.status}
        </td>

        <td className="p-2">
          {f.mode}
        </td>
      </tr>
    ))}
  </tbody>
</table>


      </div>
    </div>
  );
}
