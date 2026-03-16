"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

type GradeOption = {
  level: number;
  name: string;
  count: number;
};

export function GradePicker({
  grades,
  children,
}: {
  grades: GradeOption[];
  children: ReactNode[];
}) {
  const [selected, setSelected] = useState<number | null>(null);

  // Find index of the selected grade in the grades array
  const selectedIdx = selected !== null
    ? grades.findIndex((g) => g.level === selected)
    : -1;

  return (
    <div className="w-full">
      {/* Grade buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {grades.map((g) => (
          <button
            key={g.level}
            onClick={() => setSelected(g.level)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-medium transition-all cursor-pointer ${
              selected === g.level
                ? "bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20"
                : "border-gray-300 dark:border-gray-600 text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {g.name}
            <Badge variant="secondary" className="ml-0.5 text-xs">
              {g.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Content or prompt */}
      {selected === null ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/20 mb-4">
            <GraduationCap className="h-12 w-12 text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Select a grade to get started</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Pick a grade above to browse activities grouped by learning area
          </p>
        </div>
      ) : (
        selectedIdx >= 0 && children[selectedIdx]
      )}
    </div>
  );
}
