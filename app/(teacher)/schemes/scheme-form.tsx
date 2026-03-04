"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CascadeDropdown, type CascadeSelection } from "@/components/cbe/cascade-dropdown";
import { createSchemeOfWork, updateSchemeOfWork } from "./actions";
import { getReferenceBookOptions } from "@/lib/data/reference-books";
import { BREAK_TYPES, getPublicHolidayOptions } from "@/lib/data/scheme-breaks";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Loader2,
  Wand2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ─── Types ───

interface SubStrandOption {
  id: string;
  name: string;
  slos: { id: string; description: string }[];
}

interface StrandOption {
  id: string;
  name: string;
  subStrands: SubStrandOption[];
}

interface BreakEntry {
  title: string;
  weekNumber: number;
  duration: number;
  breakType?: string; // Selected break type from dropdown
  customTitle?: string; // Only used when breakType is "Custom"
}

interface LessonEntry {
  week: number;
  lesson: string; // e.g. "1-2", "3", "4-5"
  topic: string;
  subTopic: string;
  objectives: string;
  tlActivities: string;
  tlAids: string;
  reference: string;
  remarks: string;
}

interface SchemeDefaults {
  id?: string;
  title?: string;
  gradeId?: string;
  learningAreaId?: string;
  term?: number;
  year?: number;
  status?: string;
  schemeData?: {
    schoolName?: string;
    referenceBook?: string;
    lessonsPerWeek?: number;
    firstWeek?: number;
    firstLesson?: number;
    lastWeek?: number;
    lastLesson?: number;
    selectedSubStrandIds?: string[];
    breaks?: BreakEntry[];
    entries?: LessonEntry[];
    carryoverEnabled?: boolean;
    carryoverTopic?: string;
    carryoverSubTopic?: string;
    carryoverObjectives?: string;
    carryoverLessons?: number;
  };
}

interface SchemeFormProps {
  defaultGradeId?: string | null;
  defaults?: SchemeDefaults;
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear - 1, currentYear, currentYear + 1];

// ─── Main Form ───

export function SchemeForm({ defaultGradeId, defaults }: SchemeFormProps) {
  const isEdit = !!defaults?.id;
  const action = isEdit ? updateSchemeOfWork : createSchemeOfWork;
  const [state, formAction, pending] = useActionState(action, null);

  const [step, setStep] = useState(1);

  // Step 1: Subject & School Details
  const [gradeId, setGradeId] = useState(defaults?.gradeId || "");
  const [learningAreaId, setLearningAreaId] = useState(defaults?.learningAreaId || "");
  const [title, setTitle] = useState(defaults?.title || "");
  const [autoTitle, setAutoTitle] = useState(!defaults?.title);
  const [term, setTerm] = useState(String(defaults?.term || 1));
  const [year, setYear] = useState(String(defaults?.year || currentYear));
  const [schoolName, setSchoolName] = useState(defaults?.schemeData?.schoolName || "");
  const [referenceBook, setReferenceBook] = useState(defaults?.schemeData?.referenceBook || "");
  const [customReferenceBook, setCustomReferenceBook] = useState("");
  const [cascadeNames, setCascadeNames] = useState<{ grade?: string; learningArea?: string }>({});

  // Step 2: Topic selection
  const [strands, setStrands] = useState<StrandOption[]>([]);
  const [loadingStrands, setLoadingStrands] = useState(false);
  const [selectedSubStrandIds, setSelectedSubStrandIds] = useState<string[]>(
    defaults?.schemeData?.selectedSubStrandIds || []
  );
  const [expandedStrands, setExpandedStrands] = useState<Set<string>>(new Set());

  // Step 3: Lesson structure
  const [lessonsPerWeek, setLessonsPerWeek] = useState(defaults?.schemeData?.lessonsPerWeek || 5);
  const [firstWeek, setFirstWeek] = useState(defaults?.schemeData?.firstWeek || 2);
  const [firstLesson, setFirstLesson] = useState(defaults?.schemeData?.firstLesson || 1);
  const [lastWeek, setLastWeek] = useState(defaults?.schemeData?.lastWeek || 12);
  const [lastLesson, setLastLesson] = useState(defaults?.schemeData?.lastLesson || 5);

  // Step 4: Breaks
  const [breaks, setBreaks] = useState<BreakEntry[]>(
    defaults?.schemeData?.breaks || []
  );
  const [noBreaks, setNoBreaks] = useState(
    defaults?.schemeData?.breaks ? defaults.schemeData.breaks.length === 0 : false
  );

  // Generated entries
  const [entries, setEntries] = useState<LessonEntry[]>(
    defaults?.schemeData?.entries || []
  );

  // AI enhancement state
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Previous term carryover
  const [carryoverEnabled, setCarryoverEnabled] = useState(
    defaults?.schemeData?.carryoverEnabled || false
  );
  const [carryoverTopic, setCarryoverTopic] = useState(
    defaults?.schemeData?.carryoverTopic || ""
  );
  const [carryoverSubTopic, setCarryoverSubTopic] = useState(
    defaults?.schemeData?.carryoverSubTopic || ""
  );
  const [carryoverObjectives, setCarryoverObjectives] = useState(
    defaults?.schemeData?.carryoverObjectives || ""
  );
  const [carryoverLessons, setCarryoverLessons] = useState(
    defaults?.schemeData?.carryoverLessons || 2
  );

  // Auto-generate title
  useEffect(() => {
    if (autoTitle && cascadeNames.grade && cascadeNames.learningArea) {
      setTitle(`${cascadeNames.grade} - ${cascadeNames.learningArea} - Term ${term}, ${year}`);
    }
  }, [autoTitle, cascadeNames, term, year]);

  // Fetch strands when learning area changes
  useEffect(() => {
    if (!learningAreaId) {
      setStrands([]);
      return;
    }
    setLoadingStrands(true);
    fetch(`/api/curriculum/strands?learningAreaId=${learningAreaId}&deep=true`)
      .then((r) => r.json())
      .then((data) => {
        const s = data.strands || [];
        setStrands(s);
        setExpandedStrands(new Set(s.map((st: StrandOption) => st.id)));
      })
      .catch(() => setStrands([]))
      .finally(() => setLoadingStrands(false));
  }, [learningAreaId]);

  const toggleStrand = (strandId: string) => {
    setExpandedStrands((prev) => {
      const next = new Set(prev);
      if (next.has(strandId)) next.delete(strandId);
      else next.add(strandId);
      return next;
    });
  };

  const toggleSelectAllStrand = (strand: StrandOption) => {
    const allIds = strand.subStrands.map((s) => s.id);
    const allSelected = allIds.every((id) => selectedSubStrandIds.includes(id));
    if (allSelected) {
      setSelectedSubStrandIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedSubStrandIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const toggleSubStrand = (subStrandId: string) => {
    setSelectedSubStrandIds((prev) =>
      prev.includes(subStrandId)
        ? prev.filter((id) => id !== subStrandId)
        : [...prev, subStrandId]
    );
  };

  const selectAllSubStrands = () => {
    const allIds = strands.flatMap((s) => s.subStrands.map((ss) => ss.id));
    setSelectedSubStrandIds(allIds);
  };

  const addBreak = () => {
    setBreaks((prev) => [
      ...prev,
      {
        title: "Mid-Term Break",
        breakType: "Mid-Term Break",
        weekNumber: Math.ceil((firstWeek + lastWeek) / 2),
        duration: 1,
        customTitle: "",
      },
    ]);
  };

  const updateBreak = (index: number, updates: Partial<BreakEntry>) => {
    setBreaks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const removeBreak = (index: number) => {
    setBreaks((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Helpers for auto-filling T/L Activities & AIDS ───

  function makeTlActivities(subTopicNames: string, objectives: string): string {
    const subtopics = subTopicNames.split("\n").filter(Boolean);
    const parts: string[] = [];
    const obj = objectives.toLowerCase();

    // Vary the intro phrase for each sub-strand
    const introStyles = [
      (s: string) => `Discussion on ${s}.`,
      (s: string) => `Teacher exposition on ${s}.`,
      (s: string) => `Learner-centered exploration of ${s}.`,
      (s: string) => `Group work on ${s}.`,
      (s: string) => `Guided discovery on ${s}.`,
    ];
    for (let i = 0; i < subtopics.length; i++) {
      const style = introStyles[i % introStyles.length];
      parts.push(style(subtopics[i].trim()));
    }

    // Add objective-specific activities (more varied phrasing)
    if (obj.includes("explain") || obj.includes("describe")) {
      parts.push("Teacher-led exposition with real-life examples.");
    }
    if (obj.includes("identify") || obj.includes("classify") || obj.includes("list")) {
      parts.push("Brainstorming session and classification exercise.");
    }
    if (obj.includes("calculate") || obj.includes("determine") || obj.includes("measure")) {
      parts.push("Worked examples and practice problems.");
    }
    if (obj.includes("solve")) {
      parts.push("Problem-solving exercises in pairs.");
    }
    if (obj.includes("draw") || obj.includes("sketch") || obj.includes("diagram") || obj.includes("construct")) {
      parts.push("Guided drawing and labelling.");
    }
    if (obj.includes("compare") || obj.includes("contrast") || obj.includes("differentiate")) {
      parts.push("Group comparison and discussion activity.");
    }
    if (obj.includes("investigate") || obj.includes("experiment") || obj.includes("observe")) {
      parts.push("Practical investigation/experiment.");
    }
    if (obj.includes("apply") || obj.includes("use")) {
      parts.push("Application of concepts to real-life situations.");
    }
    if (obj.includes("analyse") || obj.includes("analyze") || obj.includes("interpret")) {
      parts.push("Data analysis and interpretation exercise.");
    }
    if (obj.includes("formulate") || obj.includes("derive")) {
      parts.push("Derivation and formulation exercises.");
    }

    // Always close with Q&A
    parts.push("Q&A session.");
    return parts.join(" ");
  }

  function makeTlAids(_refBook: string, objectives: string = ""): string {
    const aids: string[] = ["Textbook", "chalkboard", "chalk"];
    const obj = objectives.toLowerCase();
    if (obj.includes("chart") || obj.includes("graph") || obj.includes("table")) aids.push("charts");
    if (obj.includes("diagram") || obj.includes("draw")) aids.push("diagrams");
    if (obj.includes("model") || obj.includes("specimen")) aids.push("models/specimens");
    if (obj.includes("experiment") || obj.includes("practical")) aids.push("lab equipment");
    return aids.join(", ");
  }

  // Generate entries grouped by week (matching reference PDF format)
  const generateEntries = useCallback(() => {
    const actualReferenceBook =
      referenceBook === "Other (specify below)" && customReferenceBook
        ? customReferenceBook
        : referenceBook;
    const breakWeekSet = new Set<number>();
    for (const b of breaks) {
      for (let w = b.weekNumber; w < b.weekNumber + b.duration; w++) {
        breakWeekSet.add(w);
      }
    }

    // Build teaching weeks (lessons continue across breaks)
    const teachingWeeks: { week: number; startLesson: number; endLesson: number }[] = [];
    for (let w = firstWeek; w <= lastWeek; w++) {
      if (breakWeekSet.has(w)) continue;
      const start = w === firstWeek ? firstLesson : 1;
      const end = w === lastWeek ? lastLesson : lessonsPerWeek;
      teachingWeeks.push({ week: w, startLesson: start, endLesson: end });
    }

    // Get selected sub-strands in curriculum order
    const orderedSubStrands: { strandName: string; subStrand: SubStrandOption }[] = [];
    for (const strand of strands) {
      for (const sub of strand.subStrands) {
        if (selectedSubStrandIds.includes(sub.id)) {
          orderedSubStrands.push({ strandName: strand.name, subStrand: sub });
        }
      }
    }

    if (orderedSubStrands.length === 0 || teachingWeeks.length === 0) {
      setEntries([]);
      return;
    }

    const newEntries: LessonEntry[] = [];
    let weekIdx = 0;

    // ── Carryover from previous term ──
    if (carryoverEnabled && carryoverTopic && teachingWeeks.length > 0) {
      const tw = teachingWeeks[0];
      const count = Math.min(carryoverLessons, tw.endLesson - tw.startLesson + 1);
      const carryEnd = tw.startLesson + count - 1;

      const objectives = carryoverObjectives || "";
      newEntries.push({
        week: tw.week,
        lesson: tw.startLesson === carryEnd ? String(tw.startLesson) : `${tw.startLesson}-${carryEnd}`,
        topic: carryoverTopic,
        subTopic: carryoverSubTopic,
        objectives,
        tlActivities: makeTlActivities(carryoverSubTopic, objectives),
        tlAids: makeTlAids(actualReferenceBook, objectives),
        reference: actualReferenceBook || "",
        remarks: "Spillover from previous term",
      });

      // If carryover used all lessons in week 1, skip to next week
      if (carryEnd >= tw.endLesson) {
        weekIdx = 1;
      } else {
        // Remaining lessons in week 1 for curriculum content
        teachingWeeks[0] = { ...tw, startLesson: carryEnd + 1 };
      }
    }

    // ── Distribute sub-strands across ALL remaining teaching weeks ──
    // Proportional mapping ensures every week gets content, even when
    // there are more weeks than sub-strands (some subs span 2+ weeks)
    // or more subs than weeks (some weeks get multiple subs).
    const remainingWeeks = teachingWeeks.slice(weekIdx);
    const totalSubs = orderedSubStrands.length;
    const totalWeeks = remainingWeeks.length;

    for (let wIdx = 0; wIdx < totalWeeks; wIdx++) {
      const tw = remainingWeeks[wIdx];

      // Proportionally map this week to sub-strand range
      const startSub = Math.floor(wIdx * totalSubs / totalWeeks);
      const endSub = Math.floor((wIdx + 1) * totalSubs / totalWeeks);

      const weekSubs: typeof orderedSubStrands = [];
      if (startSub === endSub) {
        // Fewer subs than weeks — this week shares a sub-strand
        weekSubs.push(orderedSubStrands[startSub]);
      } else {
        for (let s = startSub; s < endSub && s < totalSubs; s++) {
          weekSubs.push(orderedSubStrands[s]);
        }
      }

      if (weekSubs.length === 0) continue;

      const lessonRange = tw.startLesson === tw.endLesson
        ? String(tw.startLesson)
        : `${tw.startLesson}-${tw.endLesson}`;

      const allSlos = weekSubs.flatMap(({ subStrand }) =>
        subStrand.slos.map((s) => s.description)
      );

      const topicName = weekSubs[0].strandName;
      const subTopicNames = weekSubs.map(({ subStrand }) => subStrand.name).join("\n");
      const objectives = allSlos.length > 0
        ? "By the end of the lesson, the learner should be able to:\n" + allSlos.map((t) => `${t}.`).join(" ")
        : "";

      newEntries.push({
        week: tw.week,
        lesson: lessonRange,
        topic: topicName,
        subTopic: subTopicNames,
        objectives,
        tlActivities: makeTlActivities(subTopicNames, objectives),
        tlAids: makeTlAids(actualReferenceBook, objectives),
        reference: actualReferenceBook || "",
        remarks: "",
      });
    }

    setEntries(newEntries);
  }, [strands, selectedSubStrandIds, breaks, firstWeek, firstLesson, lastWeek, lastLesson, lessonsPerWeek, referenceBook, customReferenceBook, carryoverEnabled, carryoverTopic, carryoverSubTopic, carryoverObjectives, carryoverLessons]);

  // Enhance entries with AI
  const enhanceWithAI = async () => {
    if (entries.length === 0) return;
    setAiEnhancing(true);
    setAiError(null);
    try {
      const res = await fetch("/api/schemes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeId,
          learningAreaId,
          referenceBook,
          entries: entries.map((e) => ({
            week: e.week,
            lesson: e.lesson,
            topic: e.topic,
            subTopic: e.subTopic,
            objectives: e.objectives,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Enhancement failed");
      }
      const { enhanced } = await res.json();
      // Merge enhanced content back into entries by week number
      setEntries((prev) =>
        prev.map((entry) => {
          const match = enhanced.find(
            (e: { week: number; objectives: string; tlActivities: string; tlAids: string }) =>
              e.week === entry.week
          );
          if (match) {
            return {
              ...entry,
              objectives: match.objectives || entry.objectives,
              tlActivities: match.tlActivities || entry.tlActivities,
              tlAids: match.tlAids || entry.tlAids,
            };
          }
          return entry;
        })
      );
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to enhance");
    } finally {
      setAiEnhancing(false);
    }
  };

  const finalReferenceBook =
    referenceBook === "Other (specify below)" && customReferenceBook
      ? customReferenceBook
      : referenceBook;

  const schemeDataJson = JSON.stringify({
    schoolName,
    referenceBook: finalReferenceBook,
    lessonsPerWeek,
    firstWeek,
    firstLesson,
    lastWeek,
    lastLesson,
    selectedSubStrandIds,
    breaks: noBreaks ? [] : breaks,
    entries,
    carryoverEnabled,
    carryoverTopic,
    carryoverSubTopic,
    carryoverObjectives,
    carryoverLessons,
  });

  const canProceedStep1 = gradeId && learningAreaId && term && year;
  const canProceedStep2 = selectedSubStrandIds.length > 0;
  const canProceedStep3 = firstWeek > 0 && lastWeek > firstWeek && lessonsPerWeek > 0;

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="id" value={defaults!.id} />}
      <input type="hidden" name="gradeId" value={gradeId} />
      <input type="hidden" name="learningAreaId" value={learningAreaId} />
      <input type="hidden" name="term" value={term} />
      <input type="hidden" name="year" value={year} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="schemeData" value={schemeDataJson} />
      <input type="hidden" name="status" value="draft" />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { n: 1, label: "Details" },
          { n: 2, label: "Topics" },
          { n: 3, label: "Structure" },
          { n: 4, label: "Breaks & Generate" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                n === step
                  ? "bg-primary text-primary-foreground"
                  : n < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {n}
            </div>
            <span className={`hidden sm:inline ${n === step ? "font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {n < 4 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* ─── Step 1: Subject & School Details ─── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject & School Details</CardTitle>
            <p className="text-sm text-muted-foreground">Fields marked with * are mandatory</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolName">School</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g., Lions High School"
                />
              </div>
              <div>
                <Label htmlFor="referenceBook">Reference Book (KICD Approved)</Label>
                <Select
                  value={referenceBook}
                  onValueChange={(val) => {
                    setReferenceBook(val);
                    if (val !== "Other (specify below)") setCustomReferenceBook("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reference book" />
                  </SelectTrigger>
                  <SelectContent>
                    {cascadeNames.grade && cascadeNames.learningArea ? (
                      getReferenceBookOptions(
                        cascadeNames.grade,
                        cascadeNames.learningArea
                      ).map((book) => (
                        <SelectItem key={book} value={book}>
                          {book}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Select grade and subject first
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {referenceBook === "Other (specify below)" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom reference book"
                    value={customReferenceBook}
                    onChange={(e) => setCustomReferenceBook(e.target.value)}
                  />
                )}
              </div>
            </div>

            <CascadeDropdown
              defaultGradeId={defaults?.gradeId || defaultGradeId}
              defaultLearningAreaId={defaults?.learningAreaId}
              onChange={(sel: CascadeSelection) => {
                setGradeId(sel.gradeId || "");
                setLearningAreaId(sel.learningAreaId || "");
              }}
              onNamesChange={(names) => setCascadeNames(names)}
              showStrand={false}
              showSLO={false}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Term *</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3].map((t) => (
                      <SelectItem key={t} value={String(t)}>Term {t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Year *</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Scheme Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setAutoTitle(false); }}
                  placeholder="Auto-generated"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" disabled={!canProceedStep1} onClick={() => setStep(2)}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Step 2: Select Topics ─── */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {cascadeNames.grade} {cascadeNames.learningArea}
              </CardTitle>
              <Badge variant="secondary">
                {selectedSubStrandIds.length} subtopics selected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Select the subtopics to cover in Term {term}. Click a strand to expand/collapse.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStrands ? (
              <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading curriculum...
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllSubStrands}>
                    Select All for Term {term}
                  </Button>
                </div>

                {strands.map((strand) => {
                  const isExpanded = expandedStrands.has(strand.id);
                  const allSelected = strand.subStrands.every((s) => selectedSubStrandIds.includes(s.id));
                  const someSelected = strand.subStrands.some((s) => selectedSubStrandIds.includes(s.id));

                  return (
                    <div key={strand.id} className="border rounded-md">
                      <div
                        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleStrand(strand.id)}
                      >
                        <Checkbox
                          checked={allSelected ? true : someSelected ? "indeterminate" : false}
                          onCheckedChange={() => toggleSelectAllStrand(strand)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {isExpanded
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        }
                        <span className="font-medium text-sm">{strand.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {strand.subStrands.length} subtopics
                        </Badge>
                      </div>
                      {isExpanded && (
                        <div className="border-t px-3 pb-3 pt-2 space-y-1.5">
                          {strand.subStrands.map((sub) => (
                            <label
                              key={sub.id}
                              className="flex items-start gap-2 cursor-pointer py-1 hover:bg-muted/30 rounded px-1"
                            >
                              <Checkbox
                                checked={selectedSubStrandIds.includes(sub.id)}
                                onCheckedChange={() => toggleSubStrand(sub.id)}
                                className="mt-0.5"
                              />
                              <span className="text-sm">{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="button" disabled={!canProceedStep2} onClick={() => setStep(3)}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Step 3: Lesson Structure ─── */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lesson Structure</CardTitle>
            <p className="text-sm text-muted-foreground">Fields marked with * are mandatory</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Number of Lessons Per Week *</Label>
              <Select value={String(lessonsPerWeek)} onValueChange={(v) => setLessonsPerWeek(Number(v))}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md p-4 space-y-3">
              <h4 className="font-medium text-sm">First Lesson Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First week of teaching *</Label>
                  <Select value={String(firstWeek)} onValueChange={(v) => setFirstWeek(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>First lesson of teaching *</Label>
                  <Select value={String(firstLesson)} onValueChange={(v) => setFirstLesson(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: lessonsPerWeek }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-3">
              <h4 className="font-medium text-sm">Last Lesson Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last week of teaching *</Label>
                  <Select value={String(lastWeek)} onValueChange={(v) => setLastWeek(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 4).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Last lesson of teaching *</Label>
                  <Select value={String(lastLesson)} onValueChange={(v) => setLastLesson(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: lessonsPerWeek }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Previous term spillover */}
            <div className="border rounded-md p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={carryoverEnabled}
                  onCheckedChange={(v) => setCarryoverEnabled(v === true)}
                />
                <span className="font-medium text-sm">Include uncompleted lesson from previous term</span>
              </label>

              {carryoverEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Topic (Strand)</Label>
                      <Input
                        value={carryoverTopic}
                        onChange={(e) => setCarryoverTopic(e.target.value)}
                        placeholder="e.g., GENETICS"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Sub-Topic</Label>
                      <Input
                        value={carryoverSubTopic}
                        onChange={(e) => setCarryoverSubTopic(e.target.value)}
                        placeholder="e.g., Gene Mutations"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Objectives</Label>
                    <Textarea
                      value={carryoverObjectives}
                      onChange={(e) => setCarryoverObjectives(e.target.value)}
                      placeholder="By the end of the lesson, the learner should be able to..."
                      className="text-sm min-h-[60px]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Number of lessons needed</Label>
                    <Select value={String(carryoverLessons)} onValueChange={(v) => setCarryoverLessons(Number(v))}>
                      <SelectTrigger className="w-32 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n} lesson{n > 1 ? "s" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="button" disabled={!canProceedStep3} onClick={() => setStep(4)}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Step 4: Breaks & Generate ─── */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Term Breaks and Interruptions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add any mid-term breaks, exams, reporting days, or holidays.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={noBreaks}
                onCheckedChange={(v) => { setNoBreaks(v === true); if (v) setBreaks([]); }}
              />
              <span className="text-sm">No Breaks</span>
            </label>

            {!noBreaks && (
              <>
                {breaks.map((b, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{b.title || `Break ${index + 1}`}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeBreak(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Type of Break/Interruption</Label>
                        <Select
                          value={b.breakType || "Mid-Term Break"}
                          onValueChange={(v) => {
                            const updates: Partial<BreakEntry> = { breakType: v };
                            // Set title based on break type
                            if (v === "Public Holiday") {
                              updates.title = ""; // Will be set when holiday is selected
                            } else if (v === "Custom (Type your own)") {
                              updates.title = b.customTitle || "";
                            } else {
                              updates.title = v;
                            }
                            updateBreak(index, updates);
                          }}
                        >
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {BREAK_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {b.breakType === "Public Holiday" && (
                        <div>
                          <Label className="text-xs">Select Holiday</Label>
                          <Select
                            value={b.title}
                            onValueChange={(v) => updateBreak(index, { title: v })}
                          >
                            <SelectTrigger className="text-sm"><SelectValue placeholder="Choose holiday" /></SelectTrigger>
                            <SelectContent>
                              {getPublicHolidayOptions().map((holiday) => (
                                <SelectItem key={holiday} value={holiday}>{holiday}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {b.breakType === "Custom (Type your own)" && (
                        <div>
                          <Label className="text-xs">Custom Title</Label>
                          <Input
                            value={b.customTitle || ""}
                            onChange={(e) => {
                              const custom = e.target.value;
                              updateBreak(index, { customTitle: custom, title: custom });
                            }}
                            placeholder="Enter custom break name"
                            className="text-sm"
                          />
                        </div>
                      )}
                      <div>
                        <Label className="text-xs">How long? (weeks)</Label>
                        <Select value={String(b.duration)} onValueChange={(v) => updateBreak(index, { duration: Number(v) })}>
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n} week{n > 1 ? "s" : ""}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Week Number</Label>
                        <Select value={String(b.weekNumber)} onValueChange={(v) => updateBreak(index, { weekNumber: Number(v) })}>
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: lastWeek - firstWeek + 1 }, (_, i) => firstWeek + i).map((n) => (
                              <SelectItem key={n} value={String(n)}>Week {n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addBreak}>
                  <Plus className="h-4 w-4 mr-2" /> New Break
                </Button>
              </>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="secondary" onClick={generateEntries}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Scheme
                </Button>
                {entries.length > 0 && (
                  <Button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={enhanceWithAI}
                    disabled={aiEnhancing}
                  >
                    {aiEnhancing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Distributes {selectedSubStrandIds.length} subtopics across Week {firstWeek}–{lastWeek}, {lessonsPerWeek} lessons/week.
                {entries.length > 0 && " Click 'Enhance with AI' to improve objectives, activities, and teaching aids."}
              </p>
              {aiError && (
                <p className="text-xs text-red-600">{aiError}</p>
              )}
            </div>

            {entries.length > 0 && (() => {
              // Build display rows: lessons + breaks interleaved by week
              const activeBreaks = noBreaks ? [] : breaks;
              type DisplayRow =
                | { kind: "lesson"; idx: number; entry: LessonEntry }
                | { kind: "break"; b: BreakEntry; weekLabel: string };
              const rows: DisplayRow[] = [];
              for (let i = 0; i < entries.length; i++) {
                rows.push({ kind: "lesson", idx: i, entry: entries[i] });
              }
              for (const b of activeBreaks) {
                const weekLabel = b.duration > 1
                  ? `${b.weekNumber}-${b.weekNumber + b.duration - 1}`
                  : String(b.weekNumber);
                rows.push({ kind: "break", b, weekLabel });
              }
              rows.sort((a, b) => {
                const wA = a.kind === "lesson" ? a.entry.week : a.b.weekNumber;
                const wB = b.kind === "lesson" ? b.entry.week : b.b.weekNumber;
                if (wA !== wB) return wA - wB;
                return a.kind === "break" ? -1 : 1;
              });

              return (
                <div className="border rounded-md overflow-x-auto mt-4">
                  <p className="text-xs text-muted-foreground p-2 bg-blue-50 border-b">
                    Click on any cell to edit. {entries.length} lesson rows generated.
                  </p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="border p-1.5 text-left w-10">WK</th>
                        <th className="border p-1.5 text-left w-10">LSN</th>
                        <th className="border p-1.5 text-left">STRAND</th>
                        <th className="border p-1.5 text-left">SUB-STRAND</th>
                        <th className="border p-1.5 text-left">OBJECTIVES</th>
                        <th className="border p-1.5 text-left">T/L ACTIVITIES</th>
                        <th className="border p-1.5 text-left">T/L AIDS</th>
                        <th className="border p-1.5 text-left">REFERENCE</th>
                        <th className="border p-1.5 text-left">REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, ri) => {
                        if (row.kind === "break") {
                          return (
                            <tr key={`brk-${ri}`} className="bg-amber-50">
                              <td className="border p-1.5 font-bold text-center">{row.weekLabel}</td>
                              <td colSpan={8} className="border p-1.5 text-center font-medium text-amber-700">
                                {row.b.title || "Break"}
                              </td>
                            </tr>
                          );
                        }
                        const i = row.idx;
                        const entry = row.entry;
                        return (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="border p-1 font-medium text-center">{entry.week}</td>
                            <td className="border p-1 text-center">{entry.lesson}</td>
                            <td className="border p-1">{entry.topic}</td>
                            <td className="border p-1 whitespace-pre-wrap">{entry.subTopic}</td>
                            <EditableCell
                              value={entry.objectives}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], objectives: v }; setEntries(n); }}
                            />
                            <EditableCell
                              value={entry.tlActivities}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], tlActivities: v }; setEntries(n); }}
                              placeholder="Discussion, Q/A, Teacher exposition..."
                            />
                            <EditableCell
                              value={entry.tlAids}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], tlAids: v }; setEntries(n); }}
                              placeholder="Textbook, charts, models..."
                            />
                            <EditableCell
                              value={entry.reference}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], reference: v }; setEntries(n); }}
                              placeholder="Book name, Pages..."
                            />
                            <EditableCell
                              value={entry.remarks}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], remarks: v }; setEntries(n); }}
                              placeholder=""
                            />
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="submit" disabled={pending || entries.length === 0}>
                {pending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                Save & Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

function EditableCell({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <td className="border p-0.5">
      <textarea
        className="w-full min-h-[3rem] text-xs p-1 bg-transparent border-0 resize-none focus:outline-none focus:bg-blue-50/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </td>
  );
}
