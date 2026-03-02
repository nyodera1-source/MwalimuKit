"use client";

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CascadeSelection {
  gradeId: string | null;
  learningAreaId: string | null;
  strandId: string | null;
  subStrandId: string | null;
  sloIds: string[];
}

interface Option {
  id: string;
  name?: string;
  description?: string;
}

interface CascadeDropdownProps {
  defaultGradeId?: string | null;
  defaultLearningAreaId?: string | null;
  onChange: (selection: CascadeSelection) => void;
  onNamesChange?: React.Dispatch<React.SetStateAction<{ grade?: string; learningArea?: string; strand?: string }>>;
  showStrand?: boolean;
  showSLO?: boolean;
}

export function CascadeDropdown({
  defaultGradeId,
  defaultLearningAreaId,
  onChange,
  onNamesChange,
  showStrand = true,
  showSLO = true,
}: CascadeDropdownProps) {
  const [grades, setGrades] = useState<Option[]>([]);
  const [learningAreas, setLearningAreas] = useState<Option[]>([]);
  const [strands, setStrands] = useState<Option[]>([]);
  const [subStrands, setSubStrands] = useState<Option[]>([]);
  const [slos, setSlos] = useState<Option[]>([]);

  const [selection, setSelection] = useState<CascadeSelection>({
    gradeId: defaultGradeId || null,
    learningAreaId: defaultLearningAreaId || null,
    strandId: null,
    subStrandId: null,
    sloIds: [],
  });

  // Fetch grades on mount
  useEffect(() => {
    fetch("/api/curriculum/grades")
      .then((r) => r.json())
      .then(setGrades);
  }, []);

  // Fetch learning areas when grade changes
  useEffect(() => {
    if (selection.gradeId) {
      fetch(`/api/curriculum/learning-areas?gradeId=${selection.gradeId}`)
        .then((r) => r.json())
        .then(setLearningAreas);
    } else {
      setLearningAreas([]);
    }
    setStrands([]);
    setSubStrands([]);
    setSlos([]);
  }, [selection.gradeId]);

  // Fetch strands when learning area changes
  useEffect(() => {
    if (selection.learningAreaId) {
      fetch(`/api/curriculum/strands?learningAreaId=${selection.learningAreaId}`)
        .then((r) => r.json())
        .then(setStrands);
    } else {
      setStrands([]);
    }
    setSubStrands([]);
    setSlos([]);
  }, [selection.learningAreaId]);

  // Fetch sub-strands when strand changes
  useEffect(() => {
    if (selection.strandId) {
      fetch(`/api/curriculum/sub-strands?strandId=${selection.strandId}`)
        .then((r) => r.json())
        .then(setSubStrands);
    } else {
      setSubStrands([]);
    }
    setSlos([]);
  }, [selection.strandId]);

  // Fetch SLOs when sub-strand changes
  useEffect(() => {
    if (selection.subStrandId && showSLO) {
      fetch(`/api/curriculum/slos?subStrandId=${selection.subStrandId}`)
        .then((r) => r.json())
        .then(setSlos);
    } else {
      setSlos([]);
    }
  }, [selection.subStrandId, showSLO]);

  const updateSelection = useCallback(
    (updates: Partial<CascadeSelection>) => {
      setSelection((prev) => {
        const next = { ...prev, ...updates };
        // Defer onChange to avoid setState-during-render
        queueMicrotask(() => onChange(next));
        return next;
      });
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Grade</Label>
        <Select
          value={selection.gradeId || ""}
          onValueChange={(val) => {
            const grade = grades.find((g) => g.id === val);
            queueMicrotask(() => onNamesChange?.({ grade: grade?.name }));
            updateSelection({
              gradeId: val,
              learningAreaId: null,
              strandId: null,
              subStrandId: null,
              sloIds: [],
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {learningAreas.length > 0 && (
        <div className="space-y-2">
          <Label>Learning Area</Label>
          <Select
            value={selection.learningAreaId || ""}
            onValueChange={(val) => {
              const la = learningAreas.find((l) => l.id === val);
              queueMicrotask(() => onNamesChange?.((prev) => ({ ...prev, learningArea: la?.name })));
              updateSelection({
                learningAreaId: val,
                strandId: null,
                subStrandId: null,
                sloIds: [],
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select learning area" />
            </SelectTrigger>
            <SelectContent>
              {learningAreas.map((la) => (
                <SelectItem key={la.id} value={la.id}>
                  {la.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showStrand && strands.length > 0 && (
        <div className="space-y-2">
          <Label>Strand</Label>
          <Select
            value={selection.strandId || ""}
            onValueChange={(val) => {
              const strand = strands.find((s) => s.id === val);
              queueMicrotask(() => onNamesChange?.((prev) => ({ ...prev, strand: strand?.name })));
              updateSelection({
                strandId: val,
                subStrandId: null,
                sloIds: [],
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strand" />
            </SelectTrigger>
            <SelectContent>
              {strands.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showStrand && subStrands.length > 0 && (
        <div className="space-y-2">
          <Label>Sub-Strand</Label>
          <Select
            value={selection.subStrandId || ""}
            onValueChange={(val) =>
              updateSelection({ subStrandId: val, sloIds: [] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-strand" />
            </SelectTrigger>
            <SelectContent>
              {subStrands.map((ss) => (
                <SelectItem key={ss.id} value={ss.id}>
                  {ss.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showSLO && slos.length > 0 && (
        <div className="space-y-2">
          <Label>Specific Learning Outcomes</Label>
          <div className="space-y-2 rounded-md border p-3">
            {slos.map((slo) => (
              <div key={slo.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`slo-${slo.id}`}
                  checked={selection.sloIds.includes(slo.id)}
                  onChange={(e) => {
                    const newIds = e.target.checked
                      ? [...selection.sloIds, slo.id]
                      : selection.sloIds.filter((id) => id !== slo.id);
                    updateSelection({ sloIds: newIds });
                  }}
                  className="mt-1"
                />
                <label htmlFor={`slo-${slo.id}`} className="text-sm cursor-pointer">
                  {slo.description}
                  {slo.description && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({(slo as { cognitiveLevel?: string }).cognitiveLevel})
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
