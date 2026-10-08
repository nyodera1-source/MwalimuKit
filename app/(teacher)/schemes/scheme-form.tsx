"use client";

import { useActionState, useState, useEffect } from "react";
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
  buildPacedLessonBatches,
  summarizePacing,
} from "@/lib/curriculum/pacing";
import { buildLessonGuidance } from "@/lib/schemes/lesson-guidance";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  ClipboardPenLine,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Save,
} from "lucide-react";

// ─── Types ───

interface SubStrandOption {
  id: string;
  name: string;
  suggestedTerm: number | null;
  suggestedLessons: number | null;
  verification: string;
  sourceRef: string | null;
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
  keyInquiryQuestion?: string;
  assessmentMethod?: string;
  remarks: string;
  strandId?: string;
  subStrandId?: string;
  sloIds?: string[];
}

function countLessonSlots(
  firstWeek: number,
  firstLesson: number,
  lastWeek: number,
  lastLesson: number,
  lessonsPerWeek: number,
  excludedWeeks: Set<number>
) {
  let total = 0;
  for (let week = firstWeek; week <= lastWeek; week++) {
    if (excludedWeeks.has(week)) continue;
    const start = week === firstWeek ? firstLesson : 1;
    const end = week === lastWeek ? lastLesson : lessonsPerWeek;
    total += Math.max(0, end - start + 1);
  }
  return total;
}

function countFirstTeachingWeekSlots(
  firstWeek: number,
  firstLesson: number,
  lastWeek: number,
  lastLesson: number,
  lessonsPerWeek: number,
  excludedWeeks: Set<number>
) {
  for (let week = firstWeek; week <= lastWeek; week++) {
    if (excludedWeeks.has(week)) continue;
    const start = week === firstWeek ? firstLesson : 1;
    const end = week === lastWeek ? lastLesson : lessonsPerWeek;
    return Math.max(0, end - start + 1);
  }
  return 0;
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

  // Step 1: Learning Area & School Details
  const [gradeId, setGradeId] = useState(defaults?.gradeId || defaultGradeId || "");
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
  const [loadingStrands, setLoadingStrands] = useState(
    Boolean(defaults?.learningAreaId)
  );
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

  const generatedTitle = cascadeNames.grade && cascadeNames.learningArea
    ? `${cascadeNames.grade} - ${cascadeNames.learningArea} - Term ${term}, ${year}`
    : "";
  const displayedTitle = autoTitle && generatedTitle ? generatedTitle : title;

  const selectedSubStrands = strands.flatMap((strand) =>
    strand.subStrands.filter((sub) => selectedSubStrandIds.includes(sub.id))
  );
  const breakWeekSet = new Set<number>();
  if (!noBreaks) {
    for (const entry of breaks) {
      for (let week = entry.weekNumber; week < entry.weekNumber + entry.duration; week++) {
        breakWeekSet.add(week);
      }
    }
  }
  const capacityBeforeBreaks = countLessonSlots(
    firstWeek,
    firstLesson,
    lastWeek,
    lastLesson,
    lessonsPerWeek,
    new Set()
  );
  const hasCarryover = carryoverEnabled && Boolean(carryoverTopic);
  const carryoverSlotsBeforeBreaks = hasCarryover
    ? Math.min(
        carryoverLessons,
        countFirstTeachingWeekSlots(
          firstWeek,
          firstLesson,
          lastWeek,
          lastLesson,
          lessonsPerWeek,
          new Set()
        )
      )
    : 0;
  const carryoverSlotsAfterBreaks = hasCarryover
    ? Math.min(
        carryoverLessons,
        countFirstTeachingWeekSlots(
          firstWeek,
          firstLesson,
          lastWeek,
          lastLesson,
          lessonsPerWeek,
          breakWeekSet
        )
      )
    : 0;
  const curriculumCapacity = Math.max(
    0,
    countLessonSlots(
      firstWeek,
      firstLesson,
      lastWeek,
      lastLesson,
      lessonsPerWeek,
      breakWeekSet
    ) - carryoverSlotsAfterBreaks
  );
  const pacingBeforeBreaks = summarizePacing(
    selectedSubStrands.map((sub) => sub.suggestedLessons),
    Math.max(0, capacityBeforeBreaks - carryoverSlotsBeforeBreaks)
  );
  const finalPacing = summarizePacing(
    selectedSubStrands.map((sub) => sub.suggestedLessons),
    curriculumCapacity
  );

  // Fetch strands when learning area changes
  useEffect(() => {
    if (!learningAreaId) return;

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

  // Generate entries grouped by week (matching reference PDF format)
  const generateEntries = () => {
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
    const orderedSubStrands: { strandId: string; strandName: string; subStrand: SubStrandOption }[] = [];
    for (const strand of strands) {
      for (const sub of strand.subStrands) {
        if (selectedSubStrandIds.includes(sub.id)) {
          orderedSubStrands.push({ strandId: strand.id, strandName: strand.name, subStrand: sub });
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
      const carryoverGuidance = buildLessonGuidance(
        cascadeNames.learningArea || "",
        carryoverSubTopic,
        carryoverObjectives || carryoverSubTopic
      );
      newEntries.push({
        week: tw.week,
        lesson: tw.startLesson === carryEnd ? String(tw.startLesson) : `${tw.startLesson}-${carryEnd}`,
        topic: carryoverTopic,
        subTopic: carryoverSubTopic,
        objectives,
        tlActivities: carryoverGuidance.activities,
        tlAids: carryoverGuidance.resources,
        reference: actualReferenceBook || "",
        keyInquiryQuestion: carryoverGuidance.inquiry,
        assessmentMethod: carryoverGuidance.assessment,
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
    // Flatten all SLOs with their sub-strand/strand context so we can
    // assign distinct objectives to each lesson row, avoiding repetition.
    const remainingWeeks = teachingWeeks.slice(weekIdx);

    interface SloItem {
      strandId: string;
      strandName: string;
      subStrandId: string;
      subStrandName: string;
      sloId: string;
      sloDescription: string;
    }

    const allSloItems: SloItem[] = orderedSubStrands.flatMap(
      ({ strandId, strandName, subStrand }) =>
        subStrand.slos.map((slo) => ({
          strandId,
          strandName,
          subStrandId: subStrand.id,
          subStrandName: subStrand.name,
          sloId: slo.id,
          sloDescription: slo.description,
        }))
    );

    // Calculate total available lesson slots
    const totalLessonSlots = remainingWeeks.reduce(
      (sum, tw) => sum + (tw.endLesson - tw.startLesson + 1),
      0
    );
    if (allSloItems.length === 0 || totalLessonSlots === 0) {
      setEntries(newEntries);
      return;
    }

    // Use the published pacing where every selected sub-strand has guidance.
    // Otherwise retain the proportional fallback for legacy curriculum rows.
    const pacedBatches = buildPacedLessonBatches(
      orderedSubStrands.map(({ strandId, strandName, subStrand }) => ({
        suggestedLessons: subStrand.suggestedLessons,
        items: subStrand.slos.map((slo) => ({
          strandId,
          strandName,
          subStrandId: subStrand.id,
          subStrandName: subStrand.name,
          sloId: slo.id,
          sloDescription: slo.description,
        })),
      })),
      totalLessonSlots
    );
    const lessonBatches = pacedBatches ?? Array.from(
      { length: totalLessonSlots },
      (_, lessonIndex) => {
        const start = Math.floor(lessonIndex * allSloItems.length / totalLessonSlots);
        const proportionalEnd = Math.floor(
          (lessonIndex + 1) * allSloItems.length / totalLessonSlots
        );
        const end = Math.max(start + 1, proportionalEnd);
        return allSloItems.slice(start, Math.min(end, allSloItems.length));
      }
    );
    let curriculumLessonIndex = 0;
    const outcomeRepeats = new Map<string, number>();

    for (const tw of remainingWeeks) {
      const lessonsInWeek = tw.endLesson - tw.startLesson + 1;

      for (let l = 0; l < lessonsInWeek; l++) {
        if (curriculumLessonIndex >= lessonBatches.length) break;
        const lessonNum = tw.startLesson + l;
        const lessonSlos = lessonBatches[curriculumLessonIndex];

        if (lessonSlos.length === 0) continue;

        const topicName = lessonSlos[0].strandName;
        const subTopicNames = [
          ...new Set(lessonSlos.map((s) => s.subStrandName)),
        ].join("\n");
        const objectives =
          "By the end of the lesson, the learner should be able to:\n" +
          lessonSlos.map((s) => `${s.sloDescription}.`).join(" ");
        const strandIds = [...new Set(lessonSlos.map((s) => s.strandId))];
        const subStrandIds = [...new Set(lessonSlos.map((s) => s.subStrandId))];
        const hasSingleCurriculumSource = strandIds.length === 1 && subStrandIds.length === 1;

        const guidanceKey = lessonSlos.map((s) => s.sloId).join("|");
        const repeatIndex = outcomeRepeats.get(guidanceKey) || 0;
        outcomeRepeats.set(guidanceKey, repeatIndex + 1);
        const guidance = buildLessonGuidance(
          cascadeNames.learningArea || "",
          subTopicNames,
          lessonSlos.map((s) => s.sloDescription).join(" "),
          repeatIndex
        );
        newEntries.push({
          week: tw.week,
          lesson: String(lessonNum),
          topic: topicName,
          subTopic: subTopicNames,
          objectives,
          tlActivities: guidance.activities,
          tlAids: guidance.resources,
          reference: actualReferenceBook || "",
          keyInquiryQuestion: guidance.inquiry,
          assessmentMethod: guidance.assessment,
          remarks: "",
          strandId: hasSingleCurriculumSource ? strandIds[0] : undefined,
          subStrandId: hasSingleCurriculumSource ? subStrandIds[0] : undefined,
          sloIds: hasSingleCurriculumSource
            ? [...new Set(lessonSlos.map((s) => s.sloId))]
            : undefined,
        });
        curriculumLessonIndex++;
      }
    }

    setEntries(newEntries);
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
      <input type="hidden" name="title" value={displayedTitle} />
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

      {/* ─── Step 1: Learning Area & School Details ─── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Area & School Details</CardTitle>
            <p className="text-sm text-muted-foreground">Fields marked with * are mandatory</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="schoolName">School</Label>
              <Input
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., Lions High School"
              />
            </div>

            <CascadeDropdown
              defaultGradeId={defaults?.gradeId || defaultGradeId}
              defaultLearningAreaId={defaults?.learningAreaId}
              onChange={(sel: CascadeSelection) => {
                const nextLearningAreaId = sel.learningAreaId || "";
                if (nextLearningAreaId !== learningAreaId) {
                  setStrands([]);
                  setSelectedSubStrandIds([]);
                  setLoadingStrands(Boolean(nextLearningAreaId));
                }
                setGradeId(sel.gradeId || "");
                setLearningAreaId(nextLearningAreaId);
              }}
              onNamesChange={(names) => setCascadeNames(names)}
              showStrand={false}
              showSLO={false}
            />

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
                      Select grade and learning area first
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
                  value={displayedTitle}
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
                              <span className="min-w-0 flex-1 text-sm">{sub.name}</span>
                              {sub.suggestedLessons && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-xs text-blue-700 border-blue-200"
                                  title={sub.sourceRef || undefined}
                                >
                                  {sub.suggestedLessons} lessons
                                </Badge>
                              )}
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

            {pacingBeforeBreaks.availability === "complete" && (
              <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>
                    Selected content: <strong>{pacingBeforeBreaks.suggestedLessons} lessons</strong>
                  </span>
                  <span>
                    Capacity before breaks: <strong>{pacingBeforeBreaks.capacity} lessons</strong>
                  </span>
                </div>
                <p className="mt-1 text-xs text-blue-700">
                  {pacingBeforeBreaks.difference === 0
                    ? "The selected content matches the available timetable."
                    : Number(pacingBeforeBreaks.difference) > 0
                      ? `${pacingBeforeBreaks.difference} lesson slots remain for other content or interruptions.`
                      : `${Math.abs(Number(pacingBeforeBreaks.difference))} more lesson slots are needed for the selected content.`}
                </p>
              </div>
            )}

            {pacingBeforeBreaks.availability === "partial" && (
              <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-700">
                Suggested lesson counts are available for only part of the selected content. Final pacing remains editable.
              </div>
            )}

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

            {finalPacing.availability === "complete" && (
              <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>
                    Selected content: <strong>{finalPacing.suggestedLessons} lessons</strong>
                  </span>
                  <span>
                    Final teaching capacity: <strong>{finalPacing.capacity} lessons</strong>
                  </span>
                </div>
                <p className="mt-1 text-xs text-blue-700">
                  {finalPacing.difference === 0
                    ? "Coverage is balanced."
                    : Number(finalPacing.difference) > 0
                      ? `${finalPacing.difference} teaching slots will remain after this content.`
                      : `${Math.abs(Number(finalPacing.difference))} suggested lessons will not fit in this timetable.`}
                </p>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="secondary" onClick={generateEntries}>
                  <ClipboardPenLine className="h-4 w-4 mr-2" />
                  Generate Scheme
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {finalPacing.availability === "complete"
                  ? `Uses the suggested pacing for ${selectedSubStrandIds.length} selected subtopics within the available timetable.`
                  : `Distributes ${selectedSubStrandIds.length} subtopics across Week ${firstWeek}-${lastWeek}, ${lessonsPerWeek} lessons/week.`}
                {entries.length > 0 && " You can edit entries in the table below, then click 'Save Scheme' when ready."}
              </p>
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
                        <th className="border p-1.5 text-left">KEY INQUIRY</th>
                        <th className="border p-1.5 text-left">RESOURCES</th>
                        <th className="border p-1.5 text-left">REFERENCE</th>
                        <th className="border p-1.5 text-left">ASSESSMENT</th>
                        <th className="border p-1.5 text-left">REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, ri) => {
                        if (row.kind === "break") {
                          return (
                            <tr key={`brk-${ri}`} className="bg-amber-50">
                              <td className="border p-1.5 font-bold text-center">{row.weekLabel}</td>
                              <td colSpan={10} className="border p-1.5 text-center font-medium text-amber-700">
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
                              value={entry.keyInquiryQuestion || ""}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], keyInquiryQuestion: v }; setEntries(n); }}
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
                              value={entry.assessmentMethod || ""}
                              onChange={(v) => { const n = [...entries]; n[i] = { ...n[i], assessmentMethod: v }; setEntries(n); }}
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
              {entries.length > 0 && (
                <Button type="submit" disabled={pending}>
                  {pending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Scheme
                </Button>
              )}
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
