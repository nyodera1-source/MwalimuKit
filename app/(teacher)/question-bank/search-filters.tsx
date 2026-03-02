"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  subjects: string[];
  grades: string[];
  years: number[];
  examTypes: string[];
}

export function SearchFilters({ subjects, grades, years, examTypes }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    q: searchParams.get("q") || "",
    subject: searchParams.get("subject") || "",
    grade: searchParams.get("grade") || "",
    year: searchParams.get("year") || "",
    type: searchParams.get("type") || "",
  };

  const hasFilters = current.q || current.subject || current.grade || current.year || current.type;

  const navigate = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value && value !== "__all__") {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      const qs = p.toString();
      router.push(`/question-bank${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/question-bank");

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject, school, grade..."
            defaultValue={current.q}
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate("q", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Dropdown filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={current.year || "__all__"} onValueChange={(v) => navigate("year", v)}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={current.subject || "__all__"} onValueChange={(v) => navigate("subject", v)}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={current.grade || "__all__"} onValueChange={(v) => navigate("grade", v)}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Grades</SelectItem>
            {grades.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={current.type || "__all__"} onValueChange={(v) => navigate("type", v)}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Types</SelectItem>
            {examTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
