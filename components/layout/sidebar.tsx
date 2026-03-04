"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  StickyNote,
  User,
  Database,
  Sparkles,
  FlaskConical,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "bg-blue-500/20 text-blue-400" },
  { href: "/lesson-plans", label: "Lesson Plans", icon: FileText, color: "bg-sky-500/20 text-sky-400" },
  { href: "/schemes", label: "Schemes of Work", icon: BookOpen, color: "bg-emerald-500/20 text-emerald-400" },
  { href: "/question-bank", label: "Question Bank", icon: Database, color: "bg-amber-500/20 text-amber-400" },
  { href: "/notes", label: "Teaching Notes", icon: StickyNote, color: "bg-purple-500/20 text-purple-400" },
  { href: "/activity-forms", label: "Activity Forms", icon: FlaskConical, color: "bg-pink-500/20 text-pink-400" },
  { href: "/profile", label: "Profile", icon: User, color: "bg-gray-500/20 text-gray-400" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full bg-[#1a1f36] text-white">
      {/* Logo */}
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">MwalimuKit</h1>
            <p className="text-[11px] text-blue-300/60">CBE Teacher Toolkit</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-500/15 text-white border-l-[3px] border-blue-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )}
            >
              <div className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
                isActive ? item.color : "bg-white/5 text-gray-500"
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Bottom branding */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[11px] text-gray-500">Grades 1-10 &middot; Kenya CBE</p>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-blue-50 text-blue-600 border-l-[3px] border-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
              isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
            )}>
              <item.icon className="h-4 w-4" />
            </div>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
