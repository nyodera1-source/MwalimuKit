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
  defaultStrandId?: string | null;
  defaultSubStrandId?: string | null;
  defaultSloIds?: string[];
  onChange: (selection: CascadeSelection) => void;
  onNamesChange?: React.Dispatch<React.SetStateAction<{ grade?: string; learningArea?: string; strand?: string }>>;
  showStrand?: boolean;
  showSLO?: boolean;
}

export function CascadeDropdown({
  defaultGradeId,
  defaultLearningAreaId,
  defaultStrandId,
  defaultSubStrandId,
  defaultSloIds = [],
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
  const [loading, setLoading] = useState({
    grades: true,
    learningAreas: false,
    strands: false,
    subStrands: false,
    slos: false,
  });
  const [error, setError] = useState<string | null>(null);

  const [selection, setSelection] = useState<CascadeSelection>({
    gradeId: defaultGradeId || null,
    learningAreaId: defaultLearningAreaId || null,
    strandId: defaultStrandId || null,
    subStrandId: defaultSubStrandId || null,
    sloIds: defaultSloIds,
  });

  // Fetch grades on mount
  useEffect(() => {
    setLoading((prev) => ({ ...prev, grades: true }));
    fetch("/api/curriculum/grades")
      .then((r) => {
        if (!r.ok) throw new Error("Could not load grades");
        return r.json();
      })
      .then((data) => {
        setGrades(data);
        setError(null);
      })
      .catch(() => setError("We could not load curriculum grades. Please refresh and try again."))
      .finally(() => setLoading((prev) => ({ ...prev, grades: false })));
  }, []);

  // Fetch learning areas when grade changes
  useEffect(() => {
    if (selection.gradeId) {
      setLoading((prev) => ({ ...prev, learningAreas: true }));
      fetch(`/api/curriculum/learning-areas?gradeId=${selection.gradeId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load learning areas");
          return r.json();
        })
        .then((data) => {
          setLearningAreas(data);
          setError(null);
        })
        .catch(() => {
          setLearningAreas([]);
          setError("We could not load learning areas for this grade.");
        })
        .finally(() => setLoading((prev) => ({ ...prev, learningAreas: false })));
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
      setLoading((prev) => ({ ...prev, strands: true }));
      fetch(`/api/curriculum/strands?learningAreaId=${selection.learningAreaId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load strands");
          return r.json();
        })
        .then((data) => {
          setStrands(data);
          setError(null);
        })
        .catch(() => {
          setStrands([]);
          setError("We could not load strands for this learning area.");
        })
        .finally(() => setLoading((prev) => ({ ...prev, strands: false })));
    } else {
      setStrands([]);
    }
    setSubStrands([]);
    setSlos([]);
  }, [selection.learningAreaId]);

  // Fetch sub-strands when strand changes
  useEffect(() => {
    if (selection.strandId) {
      setLoading((prev) => ({ ...prev, subStrands: true }));
      fetch(`/api/curriculum/sub-strands?strandId=${selection.strandId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load sub-strands");
          return r.json();
        })
        .then((data) => {
          setSubStrands(data);
          setError(null);
        })
        .catch(() => {
          setSubStrands([]);
          setError("We could not load sub-strands for this strand.");
        })
        .finally(() => setLoading((prev) => ({ ...prev, subStrands: false })));
    } else {
      setSubStrands([]);
    }
    setSlos([]);
  }, [selection.strandId]);

  // Fetch SLOs when sub-strand changes
  useEffect(() => {
    if (selection.subStrandId && showSLO) {
      setLoading((prev) => ({ ...prev, slos: true }));
      fetch(`/api/curriculum/slos?subStrandId=${selection.subStrandId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load SLOs");
          return r.json();
        })
        .then((data) => {
          setSlos(data);
          setError(null);
        })
        .catch(() => {
          setSlos([]);
          setError("We could not load learning outcomes for this sub-strand.");
        })
        .finally(() => setLoading((prev) => ({ ...prev, slos: false })));
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
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

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
            <SelectValue placeholder={loading.grades ? "Loading grades..." : "Select grade"} />
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
              <SelectValue placeholder={loading.learningAreas ? "Loading learning areas..." : "Select learning area"} />
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
              <SelectValue placeholder={loading.strands ? "Loading strands..." : "Select strand"} />
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
              <SelectValue placeholder={loading.subStrands ? "Loading sub-strands..." : "Select sub-strand"} />
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

      {showSLO && loading.slos && (
        <p className="text-sm text-muted-foreground">Loading learning outcomes...</p>
      )}
    </div>
  );
}
