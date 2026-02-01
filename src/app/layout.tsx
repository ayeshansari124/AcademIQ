import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AcademIQ",
    template: "%s | AcademIQ",
  },
  description:
    "AcademIQ is a smart school management system for attendance, fees, marks, and academic insights.",

  applicationName: "AcademIQ",
};

export const viewport: Viewport = {
  themeColor: "#0f172a", // blue-900
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />

        {children}

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
