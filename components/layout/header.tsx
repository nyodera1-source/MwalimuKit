"use client";

import { signOut } from "next-auth/react";
import { Menu, LogOut, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./sidebar";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 bg-white shadow-sm px-4 lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MwalimuKit</h1>
              <p className="text-[11px] text-muted-foreground">CBE Teacher Toolkit</p>
            </div>
          </div>
          <MobileNav />
        </SheetContent>
      </Sheet>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-auto hidden sm:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lesson plans, schemes, notes..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {userName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
