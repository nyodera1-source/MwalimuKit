"use client";

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2, ChevronDown, ChevronRight } from "lucide-react";

// ─── Types ───

export interface MultiGradeStrandSelection {
  grade: { id: string; name: string };
  selectedStrandIds: string[];
}

interface MultiGradeStrandPickerProps {
  primaryGradeId: string;
  primaryGradeName: string;
  learningAreaName: string;
  selections: MultiGradeStrandSelection[];
  onChange: (selections: MultiGradeStrandSelection[]) => void;
}

interface StrandOption {
  id: string;
  name: string;
}

interface GradeOption {
  id: string;
  name: string;
}

// ─── Main Component ───

export function MultiGradeStrandPicker({
  primaryGradeId,
  primaryGradeName,
  learningAreaName,
  selections,
  onChange,
}: MultiGradeStrandPickerProps) {
  const [allGrades, setAllGrades] = useState<GradeOption[]>([]);

  useEffect(() => {
    fetch("/api/curriculum/grades")
      .then((r) => r.json())
      .then((data: GradeOption[]) => setAllGrades(data));
  }, []);

  const addGrade = useCallback(
    (gradeId: string) => {
      const grade = allGrades.find((g) => g.id === gradeId);
      if (!grade || selections.some((s) => s.grade.id === gradeId)) return;

      onChange([...selections, { grade, selectedStrandIds: [] }]);
    },
    [allGrades, selections, onChange]
  );

  const removeGrade = useCallback(
    (gradeId: string) => {
      if (gradeId === primaryGradeId) return;
      onChange(selections.filter((s) => s.grade.id !== gradeId));
    },
    [primaryGradeId, selections, onChange]
  );

  const toggleStrand = useCallback(
    (gradeId: string, strandId: string) => {
      onChange(
        selections.map((sel) => {
          if (sel.grade.id !== gradeId) return sel;
          const has = sel.selectedStrandIds.includes(strandId);
          return {
            ...sel,
            selectedStrandIds: has
              ? sel.selectedStrandIds.filter((id) => id !== strandId)
              : [...sel.selectedStrandIds, strandId],
          };
        })
      );
    },
    [selections, onChange]
  );

  const selectAllStrands = useCallback(
    (gradeId: string, strandIds: string[]) => {
      onChange(
        selections.map((sel) => {
          if (sel.grade.id !== gradeId) return sel;
          return { ...sel, selectedStrandIds: strandIds };
        })
      );
    },
    [selections, onChange]
  );

  const availableGrades = allGrades.filter(
    (g) => !selections.some((s) => s.grade.id === g.id)
  );

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">
          Question Source Strands (Multi-Grade)
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Select strands from multiple grades for richer, more varied questions.
          Exam header will show {primaryGradeName}.
        </p>
      </div>

      <div className="space-y-2">
        {selections.map((selection) => (
          <GradeStrandSection
            key={selection.grade.id}
            selection={selection}
            isPrimary={selection.grade.id === primaryGradeId}
            learningAreaName={learningAreaName}
            onToggleStrand={(strandId) =>
              toggleStrand(selection.grade.id, strandId)
            }
            onSelectAll={(strandIds) =>
              selectAllStrands(selection.grade.id, strandIds)
            }
            onRemove={() => removeGrade(selection.grade.id)}
          />
        ))}
      </div>

      {availableGrades.length > 0 && (
        <Select value="" onValueChange={addGrade}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="+ Add another grade..." />
          </SelectTrigger>
          <SelectContent>
            {availableGrades.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// ─── Grade Section ───

interface GradeStrandSectionProps {
  selection: MultiGradeStrandSelection;
  isPrimary: boolean;
  learningAreaName: string;
  onToggleStrand: (strandId: string) => void;
  onSelectAll: (strandIds: string[]) => void;
  onRemove: () => void;
}

function GradeStrandSection({
  selection,
  isPrimary,
  learningAreaName,
  onToggleStrand,
  onSelectAll,
  onRemove,
}: GradeStrandSectionProps) {
  const [strands, setStrands] = useState<StrandOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(isPrimary);

  useEffect(() => {
    let cancelled = false;

    async function fetchStrands() {
      try {
        // Find the matching learning area for this grade
        const laRes = await fetch(
          `/api/curriculum/learning-areas?gradeId=${selection.grade.id}`
        );
        const learningAreas: { id: string; name: string }[] = await laRes.json();
        const matchingLA = learningAreas.find(
          (la) => la.name.toLowerCase() === learningAreaName.toLowerCase()
        );

        if (!matchingLA) {
          if (!cancelled) setStrands([]);
          return;
        }

        const strandsRes = await fetch(
          `/api/curriculum/strands?learningAreaId=${matchingLA.id}`
        );
        const strandsData: StrandOption[] = await strandsRes.json();
        if (!cancelled) setStrands(strandsData);
      } catch {
        if (!cancelled) setStrands([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStrands();
    return () => {
      cancelled = true;
    };
  }, [selection.grade.id, learningAreaName]);

  const allSelected =
    strands.length > 0 &&
    strands.every((s) => selection.selectedStrandIds.includes(s.id));

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 flex-1 text-left"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-medium text-sm">{selection.grade.name}</span>
            {isPrimary && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Primary
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {selection.selectedStrandIds.length} strand
              {selection.selectedStrandIds.length !== 1 ? "s" : ""}
            </span>
          </button>
          {!isPrimary && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {expanded && (
          <div className="mt-3 pl-6 space-y-2">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading strands...
              </div>
            ) : strands.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No {learningAreaName} strands found for{" "}
                {selection.grade.name}
              </p>
            ) : (
              <>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() =>
                    onSelectAll(
                      allSelected ? [] : strands.map((s) => s.id)
                    )
                  }
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
                {strands.map((strand) => (
                  <div key={strand.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`strand-${strand.id}`}
                      checked={selection.selectedStrandIds.includes(strand.id)}
                      onCheckedChange={() => onToggleStrand(strand.id)}
                    />
                    <Label
                      htmlFor={`strand-${strand.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {strand.name}
                    </Label>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
