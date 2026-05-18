"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { CascadeDropdown, type CascadeSelection } from "@/components/cbe/cascade-dropdown";
import { CompetencyCheckboxGroup } from "@/components/cbe/competency-checkbox-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardPenLine,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { saveAssignment, updateAssignment, type AssignmentQuestionData } from "./actions";

type EditableQuestion = AssignmentQuestionData & {
  localId: string;
  editing: boolean;
};

interface AssignmentFormInitial {
  id: string;
  title: string | null;
  gradeId: string;
  learningAreaId: string;
  assignmentType: string;
  term: number;
  year: number;
  weekNumber: number | null;
  totalMarks: number | null;
  timeMinutes: number | null;
  instructions: string | null;
  strandIds: string[];
  subStrandIds: string[];
  sloIds: string[];
  competencyIds: string[];
  questions: AssignmentQuestionData[];
  status: string;
  gradeName?: string;
  learningAreaName?: string;
}

interface AssignmentFormProps {
  defaultGradeId?: string | null;
  initialAssignment?: AssignmentFormInitial;
}

const ASSIGNMENT_TYPES = [
  { value: "weekly", label: "Weekly Assignment" },
  { value: "mid_term", label: "Mid-Term Assignment" },
  { value: "end_term", label: "End-Term Assignment" },
];

const DEFAULT_INSTRUCTIONS: Record<string, string> = {
  weekly: "Answer all questions. Show your working where necessary.",
  mid_term: "Answer all questions. Write your answers neatly in the spaces provided.",
  end_term: "Answer all questions. Read each question carefully before answering.",
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeInitialQuestions(questions: AssignmentQuestionData[] | undefined): EditableQuestion[] {
  return (questions || []).map((question, index) => ({
    ...question,
    orderNum: index + 1,
    localId: question.id || genId(),
    editing: false,
  }));
}

export function AssignmentForm({ defaultGradeId, initialAssignment }: AssignmentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [saving, startSaving] = useTransition();

  const action = initialAssignment
    ? updateAssignment.bind(null, initialAssignment.id)
    : saveAssignment;
  const [state, formAction] = useActionState(action, null);

  const [cascade, setCascade] = useState<CascadeSelection>({
    gradeId: initialAssignment?.gradeId || defaultGradeId || null,
    learningAreaId: initialAssignment?.learningAreaId || null,
    strandId: initialAssignment?.strandIds[0] || null,
    subStrandId: initialAssignment?.subStrandIds[0] || null,
    sloIds: initialAssignment?.sloIds || [],
  });
  const [names, setNames] = useState<{ grade?: string; learningArea?: string; strand?: string }>({
    grade: initialAssignment?.gradeName,
    learningArea: initialAssignment?.learningAreaName,
  });
  const [competencyIds, setCompetencyIds] = useState<string[]>(initialAssignment?.competencyIds || []);
  const [assignmentType, setAssignmentType] = useState(initialAssignment?.assignmentType || "weekly");
  const [term, setTerm] = useState(String(initialAssignment?.term || 1));
  const [year, setYear] = useState(String(initialAssignment?.year || new Date().getFullYear()));
  const [weekNumber, setWeekNumber] = useState(String(initialAssignment?.weekNumber || 1));
  const [title, setTitle] = useState(initialAssignment?.title || "");
  const [questionCount, setQuestionCount] = useState("8");
  const [totalMarks, setTotalMarks] = useState(String(initialAssignment?.totalMarks || 30));
  const [timeMinutes, setTimeMinutes] = useState(String(initialAssignment?.timeMinutes || 45));
  const [instructions, setInstructions] = useState(
    initialAssignment?.instructions || DEFAULT_INSTRUCTIONS[initialAssignment?.assignmentType || "weekly"]
  );
  const [questions, setQuestions] = useState<EditableQuestion[]>(
    normalizeInitialQuestions(initialAssignment?.questions)
  );
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const acceptedMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);
  const assignmentLabel = ASSIGNMENT_TYPES.find((type) => type.value === assignmentType)?.label || "Assignment";
  const autoTitle = `${names.grade || "Grade"} ${names.learningArea || "Learning Area"} - ${assignmentLabel} - Term ${term} ${year}`;
  const canProceedStep1 = Boolean(cascade.gradeId && cascade.learningAreaId);
  const canProceedStep2 = questions.some((question) => question.text.trim().length > 0);

  async function handleGenerate() {
    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/assignments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeId: cascade.gradeId,
          learningAreaId: cascade.learningAreaId,
          strandId: cascade.strandId,
          subStrandId: cascade.subStrandId,
          sloIds: cascade.sloIds,
          competencyIds,
          assignmentType,
          questionCount: Number(questionCount),
          totalMarks: Number(totalMarks),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error || "Failed to generate assignment questions.");
        return;
      }

      const generated = (data.questions as AssignmentQuestionData[]).map((question, index) => ({
        localId: genId(),
        orderNum: questions.length + index + 1,
        text: question.text,
        marks: Number(question.marks) || 1,
        answer: question.answer || "",
        cognitiveLevel: question.cognitiveLevel || "apply",
        source: "ai",
        editing: false,
      }));
      setQuestions((prev) => [...prev, ...generated]);
    } catch {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function addManualQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        localId: genId(),
        orderNum: prev.length + 1,
        text: "",
        marks: 1,
        answer: "",
        cognitiveLevel: "apply",
        source: "manual",
        editing: true,
      },
    ]);
  }

  function updateQuestion(localId: string, updates: Partial<EditableQuestion>) {
    setQuestions((prev) =>
      prev.map((question) => (question.localId === localId ? { ...question, ...updates } : question))
    );
  }

  function removeQuestion(localId: string) {
    setQuestions((prev) =>
      prev
        .filter((question) => question.localId !== localId)
        .map((question, index) => ({ ...question, orderNum: index + 1 }))
    );
  }

  function submit(status: "draft" | "published") {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    fd.set("title", title || autoTitle);
    fd.set("gradeId", cascade.gradeId || "");
    fd.set("learningAreaId", cascade.learningAreaId || "");
    fd.set("assignmentType", assignmentType);
    fd.set("term", term);
    fd.set("year", year);
    fd.set("weekNumber", assignmentType === "weekly" ? weekNumber : "");
    fd.set("totalMarks", String(acceptedMarks || Number(totalMarks) || 1));
    fd.set("timeMinutes", timeMinutes);
    fd.set("instructions", instructions);
    fd.set("strandIds", JSON.stringify(cascade.strandId ? [cascade.strandId] : []));
    fd.set("subStrandIds", JSON.stringify(cascade.subStrandId ? [cascade.subStrandId] : []));
    fd.set("sloIds", JSON.stringify(cascade.sloIds));
    fd.set("competencyIds", JSON.stringify(competencyIds));
    fd.set(
      "questions",
      JSON.stringify(
        questions.map((question, index) => ({
          id: question.id,
          orderNum: index + 1,
          text: question.text,
          marks: Number(question.marks) || 1,
          answer: question.answer || "",
          cognitiveLevel: question.cognitiveLevel || "apply",
          source: question.source || "manual",
        }))
      )
    );
    fd.set("status", status);

    startSaving(() => formAction(fd));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((currentStep) => (
          <div key={currentStep} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === step
                  ? "bg-primary text-primary-foreground"
                  : currentStep < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep < step ? <Check className="h-4 w-4" /> : currentStep}
            </div>
            {currentStep < 3 && (
              <div className={`h-0.5 w-10 ${currentStep < step ? "bg-primary/40" : "bg-muted"}`} />
            )}
          </div>
        ))}
        <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
          {["Scope", "Questions", "Preview"][step - 1]}
        </span>
      </div>

      <form ref={formRef} action={formAction}>
        {step === 1 && (
          <div className="space-y-6">
            <CascadeDropdown
              defaultGradeId={defaultGradeId || initialAssignment?.gradeId}
              defaultLearningAreaId={initialAssignment?.learningAreaId}
              defaultStrandId={initialAssignment?.strandIds[0]}
              defaultSubStrandId={initialAssignment?.subStrandIds[0]}
              defaultSloIds={initialAssignment?.sloIds || []}
              onChange={setCascade}
              onNamesChange={setNames}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Assignment Type</Label>
                <Select
                  value={assignmentType}
                  onValueChange={(value) => {
                    setAssignmentType(value);
                    setInstructions(DEFAULT_INSTRUCTIONS[value] || "");
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Input value={year} onChange={(event) => setYear(event.target.value)} />
              </div>
            </div>

            {assignmentType === "weekly" && (
              <div className="max-w-xs space-y-2">
                <Label>Week Number</Label>
                <Input
                  type="number"
                  min={1}
                  max={14}
                  value={weekNumber}
                  onChange={(event) => setWeekNumber(event.target.value)}
                />
              </div>
            )}

            <CompetencyCheckboxGroup selectedIds={competencyIds} onChange={setCompetencyIds} />

            <div className="flex justify-end">
              <Button type="button" onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={autoTitle} />
              </div>
              <div className="space-y-2">
                <Label>Target Questions</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={questionCount}
                  onChange={(event) => setQuestionCount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Marks</Label>
                <Input
                  type="number"
                  min={1}
                  value={totalMarks}
                  onChange={(event) => setTotalMarks(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Time (minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  value={timeMinutes}
                  onChange={(event) => setTimeMinutes(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={3} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardPenLine className="mr-2 h-4 w-4" />}
                {questions.length > 0 ? "Generate More" : "Generate Questions"}
              </Button>
              <Button type="button" variant="outline" onClick={addManualQuestion}>
                <Plus className="mr-2 h-4 w-4" /> Add Manual
              </Button>
              <div className="ml-auto text-sm text-muted-foreground">
                {questions.length} questions - {acceptedMarks} marks
              </div>
            </div>

            {genError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {genError}
              </div>
            )}

            {questions.length === 0 && !generating && (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <ClipboardPenLine className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">No questions yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generate CBC-aligned questions or add your own manually.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {questions.map((question, index) => (
                <Card key={question.localId}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">Q{index + 1}</span>
                      <Badge variant="secondary">{question.marks} mk{Number(question.marks) === 1 ? "" : "s"}</Badge>
                      <Badge variant="outline">{question.cognitiveLevel || "apply"}</Badge>
                      <div className="ml-auto flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuestion(question.localId, { editing: !question.editing })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeQuestion(question.localId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {question.editing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={question.text}
                          rows={3}
                          onChange={(event) => updateQuestion(question.localId, { text: event.target.value })}
                          placeholder="Question text"
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Marks</Label>
                            <Input
                              type="number"
                              min={1}
                              value={question.marks}
                              onChange={(event) => updateQuestion(question.localId, { marks: Number(event.target.value) || 1 })}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs">Cognitive Level</Label>
                            <Select
                              value={question.cognitiveLevel || "apply"}
                              onValueChange={(value) => updateQuestion(question.localId, { cognitiveLevel: value })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["remember", "understand", "apply", "analyze", "evaluate", "create"].map((level) => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Answer Guide</Label>
                          <Textarea
                            value={question.answer || ""}
                            rows={3}
                            onChange={(event) => updateQuestion(question.localId, { answer: event.target.value })}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuestion(question.localId, { editing: false })}
                        >
                          Done Editing
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="whitespace-pre-wrap text-sm">{question.text || "Empty question"}</p>
                        {question.answer && (
                          <details>
                            <summary className="cursor-pointer text-xs text-primary">Show answer guide</summary>
                            <div className="mt-2 rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">{question.answer}</div>
                          </details>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={() => setStep(3)} disabled={!canProceedStep2}>
                Preview <Eye className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="border-b pb-4 text-center">
                  <h2 className="text-xl font-bold">{title || autoTitle}</h2>
                  <p className="text-sm text-muted-foreground">
                    {assignmentLabel} - Term {term}, {year}
                    {assignmentType === "weekly" ? ` - Week ${weekNumber}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {names.grade || initialAssignment?.gradeName || "Grade"} - {names.learningArea || initialAssignment?.learningAreaName || "Learning Area"}
                  </p>
                  <p className="mt-2 text-sm font-medium">{acceptedMarks} marks - {timeMinutes} minutes</p>
                </div>

                {instructions && <p className="text-sm italic whitespace-pre-wrap">{instructions}</p>}

                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.localId} className="flex gap-3 text-sm">
                      <span className="font-semibold">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{question.text}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({question.marks} mk{Number(question.marks) === 1 ? "" : "s"})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {state?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Edit
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" disabled={saving} onClick={() => submit("draft")}>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <Button type="button" disabled={saving} onClick={() => submit("published")}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                  Save & Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
