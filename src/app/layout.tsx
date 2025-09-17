import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student CRM Dashboard | Undergraduation.com",
  description:
    "Internal CRM dashboard for managing student interactions and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Layout rendering"); // Add this
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
