"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFeeProfile } from "@/hooks/useFeeProfile";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  studentId: string;
  viewerRole: "ADMIN" | "STUDENT";
};

export default function FeeProfile({ studentId, viewerRole }: Props) {
  const { data, loading } = useFeeProfile(studentId);

  // Load Razorpay script once
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
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold">{student.fullName}</h2>
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
            <span className="text-gray-500">Status:</span>{" "}
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
            <span className="text-gray-500">Amount:</span> ₹
            {currentFee.amountDue}
          </p>

          {/* ADMIN CASH PAYMENT */}
          {viewerRole === "ADMIN" && currentFee.status !== "PAID" && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={async () => {
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

                const result = await res.json();

                if (!res.ok) {
                  toast.error(result.error || "Failed to mark paid");
                  return;
                }

                toast.success("Fee marked as paid");
                location.reload();
              }}
            >
              Mark as Paid (Cash)
            </button>
          )}

          {/* STUDENT ONLINE PAYMENT */}
          {viewerRole === "STUDENT" && currentFee.status !== "PAID" && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={async () => {
                try {
                  // 1️⃣ Create Razorpay order
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

                  if (!res.ok) {
                    throw new Error(
                      order.error || "Failed to create order"
                    );
                  }

                  // 2️⃣ Open Razorpay checkout
                  const rzp = new window.Razorpay({
                    key: order.key,
                    amount: order.amount,
                    currency: "INR",
                    name: "AcademIQ",
                    description: "Monthly Fee Payment",
                    order_id: order.orderId,

                    handler: async function (response: any) {
                      // 3️⃣ Verify payment
                      const verifyRes = await fetch(
                        "/api/student/fees/verify-payment",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            razorpay_order_id:
                              response.razorpay_order_id,
                            razorpay_payment_id:
                              response.razorpay_payment_id,
                            razorpay_signature:
                              response.razorpay_signature,
                            feeRecordId: currentFee._id,
                          }),
                        }
                      );

                      if (verifyRes.ok) {
                        toast.success("Payment successful");
                        location.reload();
                      } else {
                        toast.error(
                          "Payment verification failed"
                        );
                      }
                    },

                    theme: { color: "#16a34a" },
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
        <h3 className="font-semibold mb-2">Fee History</h3>

        <table className="w-full text-sm border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Month</th>
              <th className="p-2">Year</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {feeHistory.map((f) => (
              <tr key={f._id} className="border-b">
                <td className="p-2">{f.month}</td>
                <td className="p-2">{f.year}</td>
                <td className="p-2">₹{f.amountDue}</td>
                <td className="p-2">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
