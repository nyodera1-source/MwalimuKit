"use client";

import { useState, useEffect, useActionState, useRef, useTransition } from "react";
import { CascadeDropdown, type CascadeSelection } from "@/components/cbe/cascade-dropdown";
import { CompetencyCheckboxGroup } from "@/components/cbe/competency-checkbox-group";
import {
  MultiGradeStrandPicker,
  type MultiGradeStrandSelection,
} from "@/components/cbe/multi-grade-strand-picker";
import { QuestionUploadDialog, pickFile, type ImportedQuestion } from "@/components/exams/question-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Check,
  X,
  Pencil,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Trash2,
  GripVertical,
  Save,
  Upload,
  Type,
} from "lucide-react";
import { createExam } from "../actions";

// ─── Types ───

interface GeneratedQuestion {
  text: string;
  marks: number;
  section: string;
  answer: string;
  cognitiveLevel: string;
  needsDiagram: boolean;
  diagramDescription?: string;
  subQuestions?: { label: string; text: string; marks: number }[];
}

interface ExamQuestion extends GeneratedQuestion {
  id: string;
  accepted: boolean;
  editing: boolean;
  showAnswer: boolean;
  imageUrl?: string;
  hasImage: boolean;
  source: "ai" | "manual" | "imported";
  orderNum: number;
  sloId?: string;
}

type QuestionSource = "auto" | "upload" | "manual";

// ─── Constants ───

const ASSESSMENT_TYPES = [
  { value: "end_term", label: "End of Term" },
  { value: "mid_term", label: "Mid-Term" },
  { value: "cat", label: "CAT" },
  { value: "opener", label: "Opener" },
  { value: "formative", label: "Formative" },
];

const EXAM_TYPES = [
  { value: "written", label: "Written Exam" },
  { value: "practical", label: "Practical" },
  { value: "oral", label: "Oral" },
  { value: "project", label: "Project" },
];

const DEFAULT_INSTRUCTIONS: Record<string, string> = {
  end_term: "Answer ALL questions in the spaces provided.\nThis paper consists of TWO sections: Section A and Section B.\nSection A is compulsory.",
  mid_term: "Answer ALL questions.\nWrite your answers in the spaces provided.",
  cat: "Answer ALL questions.\nTime: as indicated.",
  opener: "Answer ALL questions.",
  formative: "Answer ALL questions.",
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Component ───

interface ExamFormProps {
  defaultGradeId?: string | null;
}

export function ExamForm({ defaultGradeId }: ExamFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Curriculum
  const [cascade, setCascade] = useState<CascadeSelection>({
    gradeId: defaultGradeId || null,
    learningAreaId: null,
    strandId: null,
    subStrandId: null,
    sloIds: [],
  });
  const [names, setNames] = useState<{ grade?: string; learningArea?: string; strand?: string }>({});
  const [competencyIds, setCompetencyIds] = useState<string[]>([]);
  const [assessmentType, setAssessmentType] = useState("end_term");
  const [examType, setExamType] = useState("written");

  // Question source
  const [questionSource, setQuestionSource] = useState<QuestionSource>("auto");

  // Multi-grade
  const [useMultiGrade, setUseMultiGrade] = useState(false);
  const [multiGradeSelections, setMultiGradeSelections] = useState<MultiGradeStrandSelection[]>([]);

  // Step 2: Configuration
  const [title, setTitle] = useState("");
  const [term, setTerm] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [questionCount, setQuestionCount] = useState("10");
  const [totalMarks, setTotalMarks] = useState("40");
  const [timeMinutes, setTimeMinutes] = useState("60");
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS.end_term);
  const [cognitiveLevel, setCognitiveLevel] = useState("");

  // Step 3: Questions
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadPendingFile, setUploadPendingFile] = useState<File | null>(null);

  // Step 4: Save
  const [state, formAction] = useActionState(createExam, null);
  const [saving, startTransition] = useTransition();

  // Derived
  const acceptedQuestions = questions.filter((q) => q.accepted);
  const acceptedMarks = acceptedQuestions.reduce((sum, q) => sum + q.marks, 0);

  // Auto-generate title
  const autoTitle = `${names.grade || "Grade"} ${names.learningArea || "Subject"} - ${ASSESSMENT_TYPES.find((t) => t.value === assessmentType)?.label || "Exam"} - Term ${term} ${year}`;

  // Initialize multi-grade with primary grade when cascade changes
  useEffect(() => {
    if (cascade.gradeId && names.grade) {
      setMultiGradeSelections((prev) => {
        const hasPrimary = prev.some((s) => s.grade.id === cascade.gradeId);
        if (hasPrimary) return prev;
        return [
          {
            grade: { id: cascade.gradeId!, name: names.grade! },
            selectedStrandIds: cascade.strandId ? [cascade.strandId] : [],
          },
        ];
      });
    }
  }, [cascade.gradeId, cascade.strandId, names.grade]);

  // ─── Step navigation ───

  const canProceedStep1 = cascade.gradeId && cascade.learningAreaId;
  const canProceedStep3 = acceptedQuestions.length > 0;

  function nextStep() {
    if (step === 1 && !canProceedStep1) return;
    if (step === 2 && !title) setTitle(autoTitle);
    setStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  // ─── AI Generation ───

  async function handleGenerate() {
    setGenerating(true);
    setGenError("");

    try {
      // Build multi-grade payload if enabled
      const multiGradePayload =
        useMultiGrade
          ? multiGradeSelections
              .filter((sel) => sel.selectedStrandIds.length > 0)
              .map((sel) => ({
                gradeId: sel.grade.id,
                strandIds: sel.selectedStrandIds,
              }))
          : undefined;

      const res = await fetch("/api/exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeId: cascade.gradeId,
          learningAreaId: cascade.learningAreaId,
          strandId: useMultiGrade ? undefined : cascade.strandId,
          subStrandId: useMultiGrade ? undefined : cascade.subStrandId,
          sloIds: useMultiGrade ? undefined : cascade.sloIds,
          multiGradeSelections: multiGradePayload,
          competencyIds,
          assessmentType,
          questionCount: parseInt(questionCount),
          totalMarks: parseInt(totalMarks),
          cognitiveLevel: cognitiveLevel || undefined,
          excludeDiagrams: true, // Always exclude diagrams for AI generation
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error || "Failed to generate questions.");
        return;
      }

      const startOrder = questions.length;
      const newQuestions: ExamQuestion[] = (data.questions as GeneratedQuestion[]).map((q, i) => ({
        ...q,
        id: genId(),
        accepted: true,
        editing: false,
        showAnswer: false,
        hasImage: false,
        source: "ai" as const,
        orderNum: startOrder + i + 1,
      }));

      setQuestions((prev) => [...prev, ...newQuestions]);
    } catch {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ─── Import questions from upload dialog ───

  function handleImportedQuestions(imported: ImportedQuestion[]) {
    setQuestions((prev) => [
      ...prev,
      ...imported.map((q, i) => ({
        ...q,
        orderNum: prev.length + i + 1,
        needsDiagram: false,
        diagramDescription: undefined,
      })),
    ]);
  }

  // ─── Question actions ───

  function toggleAccept(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, accepted: !q.accepted } : q)));
  }

  function toggleEdit(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, editing: !q.editing } : q)));
  }

  function toggleAnswer(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, showAnswer: !q.showAnswer } : q)));
  }

  function updateQuestion(id: string, updates: Partial<ExamQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function moveQuestion(id: string, dir: -1 | 1) {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((q, i) => ({ ...q, orderNum: i + 1 }));
    });
  }

  function handleImageUpload(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateQuestion(id, { imageUrl: reader.result as string, hasImage: true });
    };
    reader.readAsDataURL(file);
  }

  function addManualQuestion() {
    const newQ: ExamQuestion = {
      id: genId(),
      text: "",
      marks: 2,
      section: "A",
      answer: "",
      cognitiveLevel: "apply",
      needsDiagram: false,
      accepted: true,
      editing: true,
      showAnswer: false,
      hasImage: false,
      source: "manual",
      orderNum: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQ]);
  }

  // ─── Save ───

  function handleSave(status: "draft" | "published") {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    fd.set("title", title || autoTitle);
    fd.set("gradeId", cascade.gradeId || "");
    fd.set("learningAreaId", cascade.learningAreaId || "");
    fd.set("examType", examType);
    fd.set("assessmentType", assessmentType);
    fd.set("term", term);
    fd.set("year", year);
    fd.set("totalMarks", acceptedMarks.toString());
    fd.set("timeMinutes", timeMinutes);
    fd.set("instructions", instructions);

    // Aggregate strand IDs from multi-grade selections or single cascade
    const allStrandIds = useMultiGrade
      ? multiGradeSelections.flatMap((sel) => sel.selectedStrandIds)
      : cascade.strandId
        ? [cascade.strandId]
        : [];

    fd.set("strandIds", JSON.stringify(allStrandIds));
    fd.set("subStrandIds", JSON.stringify(cascade.subStrandId ? [cascade.subStrandId] : []));
    fd.set("sloIds", JSON.stringify(useMultiGrade ? [] : cascade.sloIds));
    fd.set("competencyIds", JSON.stringify(competencyIds));
    fd.set("status", status);

    const qData = acceptedQuestions.map((q, i) => ({
      orderNum: i + 1,
      section: q.section,
      text: q.text,
      marks: q.marks,
      imageUrl: q.imageUrl || undefined,
      hasImage: q.hasImage,
      answer: q.answer,
      cognitiveLevel: q.cognitiveLevel,
      sloId: q.sloId || undefined,
      subQuestions: q.subQuestions || undefined,
      source: q.source,
    }));
    fd.set("questions", JSON.stringify(qData));

    startTransition(() => formAction(fd));
  }

  // ─── Cognitive level badge color ───
  function cogColor(level: string) {
    const colors: Record<string, string> = {
      remember: "bg-blue-100 text-blue-800",
      understand: "bg-cyan-100 text-cyan-800",
      apply: "bg-green-100 text-green-800",
      analyze: "bg-yellow-100 text-yellow-800",
      evaluate: "bg-orange-100 text-orange-800",
      create: "bg-purple-100 text-purple-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div className={`h-0.5 w-8 sm:w-12 ${s < step ? "bg-primary/40" : "bg-muted"}`} />
            )}
          </div>
        ))}
        <span className="ml-3 text-sm text-muted-foreground hidden sm:inline">
          {["Curriculum", "Settings", "Questions", "Save"][step - 1]}
        </span>
      </div>

      <form ref={formRef} action={formAction}>
        {/* ═══ STEP 1: Curriculum Selection ═══ */}
        {step === 1 && (
          <div className="space-y-6">
            <CascadeDropdown
              defaultGradeId={defaultGradeId}
              onChange={setCascade}
              onNamesChange={setNames}
              showStrand={!useMultiGrade}
              showSLO={!useMultiGrade}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assessment Type</Label>
                <Select value={assessmentType} onValueChange={(v) => {
                  setAssessmentType(v);
                  setInstructions(DEFAULT_INSTRUCTIONS[v] || "");
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exam Format</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question Source Selector */}
            <div className="space-y-2">
              <Label>How would you like to create questions?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { value: "auto" as const, label: "Auto-generate", icon: Sparkles, desc: "AI generates text-only questions" },
                  { value: "upload" as const, label: "Upload File", icon: Upload, desc: "Import from PDF or Word" },
                  { value: "manual" as const, label: "Type Manually", icon: Type, desc: "Create questions from scratch" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setQuestionSource(opt.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      questionSource === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/30"
                    }`}
                  >
                    <opt.icon className={`h-5 w-5 mb-1 ${questionSource === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
              {questionSource === "auto" && (
                <p className="text-xs text-muted-foreground">
                  For questions needing diagrams, use &quot;Upload File&quot; or &quot;Type Manually&quot; and attach images.
                </p>
              )}
            </div>

            {/* Multi-Grade Strand Selection */}
            {cascade.learningAreaId && questionSource === "auto" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="use-multi-grade"
                    checked={useMultiGrade}
                    onCheckedChange={(checked) => setUseMultiGrade(!!checked)}
                  />
                  <Label htmlFor="use-multi-grade" className="cursor-pointer text-sm">
                    Include content from other grades for richer question variety
                  </Label>
                </div>
                {useMultiGrade && names.grade && names.learningArea && cascade.gradeId && (
                  <MultiGradeStrandPicker
                    primaryGradeId={cascade.gradeId}
                    primaryGradeName={names.grade}
                    learningAreaName={names.learningArea}
                    selections={multiGradeSelections}
                    onChange={setMultiGradeSelections}
                  />
                )}
              </div>
            )}

            <CompetencyCheckboxGroup selectedIds={competencyIds} onChange={setCompetencyIds} />

            <div className="flex justify-end">
              <Button type="button" onClick={nextStep} disabled={!canProceedStep1}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Configuration ═══ */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={autoTitle}
              />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Term 1</SelectItem>
                    <SelectItem value="2">Term 2</SelectItem>
                    <SelectItem value="3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" />
              </div>

              {questionSource === "auto" && (
                <div className="space-y-2">
                  <Label>Questions</Label>
                  <Input
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    type="number"
                    min={1}
                    max={30}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  type="number"
                  min={10}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time (minutes)</Label>
                <Input
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(e.target.value)}
                  type="number"
                />
              </div>

              {questionSource === "auto" && (
                <div className="space-y-2">
                  <Label>Cognitive Level Focus (optional)</Label>
                  <Select value={cognitiveLevel || "__none__"} onValueChange={(v) => setCognitiveLevel(v === "__none__" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Mixed (default)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Mixed (default)</SelectItem>
                      <SelectItem value="remember">Remember</SelectItem>
                      <SelectItem value="understand">Understand</SelectItem>
                      <SelectItem value="apply">Apply</SelectItem>
                      <SelectItem value="analyze">Analyze</SelectItem>
                      <SelectItem value="evaluate">Evaluate</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Generate & Review ═══ */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Question source controls */}
            <div className="flex flex-wrap items-center gap-2">
              {questionSource === "auto" && (
                <Button type="button" onClick={handleGenerate} disabled={generating}>
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {questions.length > 0 ? "Generate More" : "Generate Questions"}
                </Button>
              )}

              {questionSource === "upload" && (
                <Button
                  type="button"
                  onClick={async () => {
                    // Pick file OUTSIDE any dialog/portal to avoid Windows navigation bug
                    const file = await pickFile(".pdf,.docx");
                    if (file) {
                      setUploadPendingFile(file);
                      setUploadDialogOpen(true);
                    }
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {questions.length > 0 ? "Upload More" : "Upload Questions"}
                </Button>
              )}

              {/* Always allow manual addition */}
              <Button type="button" variant="outline" onClick={addManualQuestion}>
                + Add Manual
              </Button>

              {/* Also allow AI generation even if source is upload/manual */}
              {questionSource !== "auto" && questions.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="text-xs"
                >
                  {generating ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  AI Generate More
                </Button>
              )}

              {questions.length > 0 && (
                <div className="ml-auto text-sm font-medium">
                  <span className={acceptedMarks === parseInt(totalMarks) ? "text-green-600" : "text-amber-600"}>
                    {acceptedMarks}
                  </span>
                  <span className="text-muted-foreground"> / {totalMarks} marks</span>
                  <span className="text-muted-foreground ml-2">
                    ({acceptedQuestions.length} Q{acceptedQuestions.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            {genError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {genError}
              </div>
            )}

            {generating && questions.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
                <p className="text-sm font-medium">Generating questions...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take 10-20 seconds
                </p>
              </div>
            )}

            {/* Question cards */}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <Card
                  key={q.id}
                  className={`transition-opacity ${!q.accepted ? "opacity-50" : ""}`}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                      <span className="font-semibold text-sm">Q{idx + 1}</span>
                      <Badge variant="outline" className="text-xs">Sec {q.section}</Badge>
                      <Badge variant="secondary" className="text-xs">{q.marks} mk{q.marks !== 1 ? "s" : ""}</Badge>
                      <Badge className={`text-xs ${cogColor(q.cognitiveLevel)}`}>
                        {q.cognitiveLevel}
                      </Badge>
                      {q.source !== "ai" && (
                        <Badge variant="outline" className="text-xs">{q.source}</Badge>
                      )}

                      {/* Actions — right side */}
                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          type="button" variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => moveQuestion(q.id, -1)}
                          disabled={idx === 0}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button" variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => moveQuestion(q.id, 1)}
                          disabled={idx === questions.length - 1}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Question text */}
                    {q.editing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          rows={3}
                          placeholder="Question text..."
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Marks</Label>
                            <Input
                              type="number"
                              value={q.marks}
                              onChange={(e) => updateQuestion(q.id, { marks: parseInt(e.target.value) || 1 })}
                              min={1}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Section</Label>
                            <Select value={q.section} onValueChange={(v) => updateQuestion(q.id, { section: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Level</Label>
                            <Select value={q.cognitiveLevel} onValueChange={(v) => updateQuestion(q.id, { cognitiveLevel: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["remember", "understand", "apply", "analyze", "evaluate", "create"].map((l) => (
                                  <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Answer / Marking Scheme</Label>
                          <Textarea
                            value={q.answer}
                            onChange={(e) => updateQuestion(q.id, { answer: e.target.value })}
                            rows={3}
                            placeholder="Expected answer and mark allocation..."
                          />
                        </div>
                        <Button type="button" size="sm" variant="outline" onClick={() => toggleEdit(q.id)}>
                          Done Editing
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{q.text}</p>
                    )}

                    {/* Sub-questions preview */}
                    {!q.editing && q.subQuestions && q.subQuestions.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {q.subQuestions.map((sq, si) => (
                          <p key={si} className="text-xs text-muted-foreground">
                            <span className="font-medium">({sq.label})</span> {sq.text}
                            {sq.marks > 0 && <span className="ml-1">[{sq.marks} mk{sq.marks !== 1 ? "s" : ""}]</span>}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Image preview */}
                    {q.hasImage && q.imageUrl && (
                      <div className="relative inline-block">
                        <img
                          src={q.imageUrl}
                          alt="Question diagram"
                          className="max-h-40 rounded border"
                        />
                        <Button
                          type="button" variant="destructive" size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => updateQuestion(q.id, { imageUrl: undefined, hasImage: false })}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Answer toggle */}
                    {!q.editing && q.answer && (
                      <div>
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                          onClick={() => toggleAnswer(q.id)}
                        >
                          {q.showAnswer ? "Hide" : "Show"} answer
                          {q.showAnswer ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                        {q.showAnswer && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap">
                            {q.answer}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    {!q.editing && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          type="button" size="sm"
                          variant={q.accepted ? "default" : "outline"}
                          className="h-7 text-xs"
                          onClick={() => toggleAccept(q.id)}
                        >
                          {q.accepted ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          {q.accepted ? "Accepted" : "Dropped"}
                        </Button>
                        <Button
                          type="button" size="sm" variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toggleEdit(q.id)}
                        >
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        {/* Image upload — always available for manual/uploaded questions */}
                        <label className="inline-flex items-center cursor-pointer">
                          <Button type="button" size="sm" variant="outline" className="h-7 text-xs" asChild>
                            <span>
                              <ImagePlus className="h-3 w-3 mr-1" /> Image
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(q.id, e)}
                          />
                        </label>
                        <Button
                          type="button" size="sm" variant="ghost"
                          className="h-7 text-xs text-red-500 hover:text-red-700"
                          onClick={() => removeQuestion(q.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty state */}
            {questions.length === 0 && !generating && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                {questionSource === "auto" && (
                  <>
                    <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">No questions yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click &quot;Generate Questions&quot; to use AI
                    </p>
                  </>
                )}
                {questionSource === "upload" && (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">No questions yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click &quot;Upload Questions&quot; to import from a file
                    </p>
                  </>
                )}
                {questionSource === "manual" && (
                  <>
                    <Type className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">No questions yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click &quot;+ Add Manual&quot; to start typing questions
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button type="button" onClick={nextStep} disabled={!canProceedStep3}>
                Review & Save <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Finalize & Save ═══ */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Assessment Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="font-medium">{title || autoTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p>{names.grade || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p>{names.learningArea || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p>{ASSESSMENT_TYPES.find((t) => t.value === assessmentType)?.label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Term / Year</p>
                    <p>Term {term}, {year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p>{timeMinutes} minutes</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p>{acceptedQuestions.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Marks</p>
                    <p className="font-medium">{acceptedMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sections</p>
                    <p>{[...new Set(acceptedQuestions.map((q) => q.section))].sort().join(", ") || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question list preview */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Questions ({acceptedQuestions.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {acceptedQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-2 text-sm">
                      <span className="font-medium shrink-0">Q{i + 1}.</span>
                      <span className="text-muted-foreground line-clamp-1 flex-1">
                        {q.text.substring(0, 80)}{q.text.length > 80 ? "..." : ""}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-xs">{q.marks}mk</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => handleSave("draft")}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave("published")}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Publish
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Upload dialog */}
      <QuestionUploadDialog
        open={uploadDialogOpen}
        onOpenChange={(val) => {
          setUploadDialogOpen(val);
          if (!val) setUploadPendingFile(null);
        }}
        onQuestionsImported={handleImportedQuestions}
        startOrderNum={questions.length + 1}
        pendingFile={uploadPendingFile}
      />
    </div>
  );
}
