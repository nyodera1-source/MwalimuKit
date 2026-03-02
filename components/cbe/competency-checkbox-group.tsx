"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CompetencyCheckboxGroupProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CompetencyCheckboxGroup({
  selectedIds,
  onChange,
}: CompetencyCheckboxGroupProps) {
  const [competencies, setCompetencies] = useState<
    { id: string; name: string; description: string | null }[]
  >([]);

  useEffect(() => {
    fetch("/api/curriculum/competencies")
      .then((r) => r.json())
      .then(setCompetencies);
  }, []);

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((c) => c !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Core Competencies</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {competencies.map((c) => (
          <div key={c.id} className="flex items-center space-x-2">
            <Checkbox
              id={`comp-${c.id}`}
              checked={selectedIds.includes(c.id)}
              onCheckedChange={() => toggle(c.id)}
            />
            <Label
              htmlFor={`comp-${c.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {c.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
