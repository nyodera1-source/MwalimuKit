import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MwalimuKit — CBE Teacher Toolkit",
  description:
    "Create CBE-aligned lesson plans, schemes of work, and teaching notes for Kenyan teachers (Grade 1-10).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
