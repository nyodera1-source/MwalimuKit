import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-hero px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 rounded-md bg-white px-3 py-2">
        <Wordmark size="lg" className="w-[220px]" />
      </Link>
      {/* Auth card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
