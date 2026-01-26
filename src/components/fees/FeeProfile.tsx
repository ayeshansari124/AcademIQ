"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type FeeRecord = {
  _id: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  status: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
  dueDate: string;
  paidAt?: string; // ✅ ADD THIS
};


type Props = {
  studentId: string;
  viewerRole: "ADMIN" | "STUDENT";
};

export default function FeeProfile({ studentId, viewerRole }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/student/fees/${studentId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
          return;
        }
        setData(res);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>Loading fees...</p>;
 if (!data || data.error) {
  return <p className="p-6">Failed to load fee data</p>;
}


  const {
  student,
  currentFee,
  feeHistory = [],
} = data;


  return (
    <div className="space-y-6">
      {/* STUDENT HEADER */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold">{student.fullName}</h2>
        <p className="text-sm text-gray-500">
          Class: {student.class?.name}
        </p>
        <p className="mt-2 font-medium">
          Monthly Fee: ₹{student.monthlyFee}
        </p>
      </div>

      {/* CURRENT MONTH STATUS */}
     <div className="border rounded p-4 bg-white shadow-sm">
  <h3 className="font-semibold mb-3 text-lg">
    Current Fee Status
  </h3>

  {currentFee ? (
    <>
      <div className="space-y-1 text-sm">
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

        <p>
          <span className="text-gray-500">Amount Due:</span>{" "}
          ₹{currentFee.amountDue}
        </p>

        {currentFee.status === "PAID" ? (
  <p>
    <span className="text-gray-500">Paid On:</span>{" "}
    <b className="text-green-600">
      {currentFee.paidAt
        ? new Date(currentFee.paidAt).toLocaleDateString()
        : "—"}
    </b>
  </p>
) : (
  <p>
    <span className="text-gray-500">Due Date:</span>{" "}
    {new Date(currentFee.dueDate).toLocaleDateString()}
  </p>
)}

      </div>

      {viewerRole === "ADMIN" &&
        currentFee.status !== "PAID" && (
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

              const data = await res.json();

              if (!res.ok) {
                toast.error(data.error || "Failed");
                return;
              }

              toast.success("Fee marked as paid");
              location.reload();
            }}
          >
            Mark as Paid (Cash)
          </button>
        )}

     {viewerRole === "STUDENT" &&
  currentFee.status !== "PAID" && (
    <button
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      onClick={async () => {
        try {
          // 1️⃣ Create Razorpay order
          const res = await fetch(
            "/api/student/fees/create-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                feeRecordId: currentFee._id,
              }),
            }
          );

          const order = await res.json();

          if (!res.ok) {
            toast.error(order.error || "Failed to create order");
            return;
          }

          // 2️⃣ Open Razorpay checkout
          const options = {
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
                    razorpay_order_id: response.razorpay_order_id,
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
                toast.error("Payment verification failed");
              }
            },
            theme: { color: "#16a34a" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (err) {
          toast.error("Payment failed");
        }
      }}
    >
      Pay Now
    </button>
  )}

    </>
  ) : (
    <p className="text-gray-500">
      No active fee record found.
    </p>
  )}
</div>


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
            {feeHistory.map((f: FeeRecord) => (
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
