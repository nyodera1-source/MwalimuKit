"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2, Save, Check, ChevronDown, ChevronRight, ImagePlus } from "lucide-react";
import { createQuestionPaper, updateQuestionPaper, updateQuestion as saveQuestion } from "./actions";

// ─── Types ───

interface QuestionEntry {
  id?: string;
  questionNumber: string;
  section: string;
  text: string;
  marks: number | null;
  topic: string;
  subTopic: string;
  answer: string;
  hasImage?: boolean;
  imageUrl?: string;
  subQuestions: { label: string; text: string; marks: number | null }[];
}

interface PaperDefaults {
  id?: string;
  subject?: string;
  gradeLevel?: string;
  year?: number;
  term?: number | null;
  examType?: string;
  school?: string | null;
  source?: string | null;
  paperNumber?: number | null;
  totalMarks?: number | null;
  timeMinutes?: number | null;
  questions?: QuestionEntry[];
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

const SUBJECTS = [
  "Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics",
  "History", "Geography", "CRE", "IRE", "Business Studies", "Agriculture",
  "Home Science", "Computer Studies", "Art & Design", "Music",
  "French", "German", "Arabic", "Integrated Science", "Social Studies",
];

const GRADE_LEVELS = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Form 1", "Form 2", "Form 3", "Form 4",
];

const EXAM_TYPES = [
  "KCSE", "Mock", "End Term", "Mid Term", "Opening Term", "Pre-Mock", "CAT", "Question Pool",
];

const BIOLOGY_STRANDS = [
  "Cell Biology and Biodiversity",
  "Anatomy and Physiology of Animals",
  "Anatomy and Physiology of Plants",
];

// ─── Main Form ───

export function PaperForm({ defaults }: { defaults?: PaperDefaults }) {
  const isEdit = !!defaults?.id;
  const action = isEdit ? updateQuestionPaper : createQuestionPaper;
  const [state, formAction, pending] = useActionState(action, null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [subject, setSubject] = useState(defaults?.subject || "");
  const [gradeLevel, setGradeLevel] = useState(defaults?.gradeLevel || "");
  const [year, setYear] = useState(defaults?.year || currentYear);
  const [term, setTerm] = useState<string>(defaults?.term ? String(defaults.term) : "__none__");
  const [examType, setExamType] = useState(defaults?.examType || "End Term");
  const [school, setSchool] = useState(defaults?.school || "");
  const [source, setSource] = useState(defaults?.source || "");
  const [paperNumber, setPaperNumber] = useState<string>(
    defaults?.paperNumber ? String(defaults.paperNumber) : "__none__"
  );
  const [totalMarks, setTotalMarks] = useState<string>(
    defaults?.totalMarks ? String(defaults.totalMarks) : ""
  );
  const [timeMinutes, setTimeMinutes] = useState<string>(
    defaults?.timeMinutes ? String(defaults.timeMinutes) : ""
  );

  const [questions, setQuestions] = useState<QuestionEntry[]>(
    defaults?.questions || []
  );
  const [expandedQ, setExpandedQ] = useState<Set<number>>(new Set());

  const toggleExpand = (i: number) => {
    setExpandedQ((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const addQuestion = () => {
    const num = String(questions.length + 1);
    setQuestions((prev) => [
      ...prev,
      { questionNumber: num, section: "", text: "", marks: null, topic: "", subTopic: "", answer: "", subQuestions: [] },
    ]);
    setExpandedQ((prev) => new Set([...prev, questions.length]));
  };

  const updateQuestionLocal = (index: number, updates: Partial<QuestionEntry>) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setExpandedQ((prev) => {
      const next = new Set<number>();
      for (const v of prev) {
        if (v < index) next.add(v);
        else if (v > index) next.add(v - 1);
      }
      return next;
    });
  };

  const handleSaveQuestion = (index: number) => {
    const q = questions[index];
    if (!q.id) return; // Can't save a question without a DB id
    setSavingIndex(index);
    startTransition(async () => {
      await saveQuestion({
        id: q.id!,
        text: q.text,
        marks: q.marks,
        answer: q.answer || null,
        topic: q.topic || null,
        subTopic: q.subTopic || null,
        hasImage: q.hasImage,
        imageUrl: q.imageUrl || null,
        subQuestions: q.subQuestions.length > 0 ? q.subQuestions : null,
      });
      setSavingIndex(null);
      setSavedIndex(index);
      setTimeout(() => setSavedIndex(null), 2000);
    });
  };

  const addSubQuestion = (qIndex: number) => {
    const q = questions[qIndex];
    const labels = "abcdefghij";
    const label = labels[q.subQuestions.length] || String(q.subQuestions.length + 1);
    updateQuestionLocal(qIndex, {
      subQuestions: [...q.subQuestions, { label, text: "", marks: null }],
    });
  };

  const updateSubQuestion = (
    qIndex: number,
    sIndex: number,
    updates: Partial<{ label: string; text: string; marks: number | null }>
  ) => {
    const q = questions[qIndex];
    const subs = [...q.subQuestions];
    subs[sIndex] = { ...subs[sIndex], ...updates };
    updateQuestionLocal(qIndex, { subQuestions: subs });
  };

  const removeSubQuestion = (qIndex: number, sIndex: number) => {
    const q = questions[qIndex];
    updateQuestionLocal(qIndex, {
      subQuestions: q.subQuestions.filter((_, i) => i !== sIndex),
    });
  };

  const questionsJson = JSON.stringify(questions);

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {isEdit && <input type="hidden" name="id" value={defaults!.id} />}
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="gradeLevel" value={gradeLevel} />
      <input type="hidden" name="year" value={year} />
      <input type="hidden" name="term" value={term === "__none__" ? "" : term} />
      <input type="hidden" name="examType" value={examType} />
      <input type="hidden" name="school" value={school} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="paperNumber" value={paperNumber === "__none__" ? "" : paperNumber} />
      <input type="hidden" name="totalMarks" value={totalMarks} />
      <input type="hidden" name="timeMinutes" value={timeMinutes} />
      <input type="hidden" name="questions" value={questionsJson} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      {/* Paper Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paper Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade / Form *</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Year *</Label>
              <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Term</Label>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger><SelectValue placeholder="N/A" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">N/A (Annual/KCSE)</SelectItem>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exam Type *</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Paper #</Label>
              <Select value={paperNumber} onValueChange={setPaperNumber}>
                <SelectTrigger><SelectValue placeholder="N/A" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">N/A</SelectItem>
                  <SelectItem value="1">Paper 1</SelectItem>
                  <SelectItem value="2">Paper 2</SelectItem>
                  <SelectItem value="3">Paper 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input
                type="number"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                placeholder="e.g. 120"
              />
            </div>
            <div>
              <Label>School</Label>
              <Input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Alliance High"
              />
            </div>
            <div>
              <Label>Source</Label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="URL or manual"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Questions ({questions.length})</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No questions yet. Click &quot;Add Question&quot; to start.
            </p>
          )}

          {questions.map((q, i) => {
            const isExpanded = expandedQ.has(i);
            const isSaving = savingIndex === i;
            const isSaved = savedIndex === i;
            return (
              <div key={q.id || i} className="border rounded-md">
                {/* Question header (collapsible) */}
                <div
                  className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(i)}
                >
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                  <span className="font-medium text-sm shrink-0">
                    Q{q.questionNumber}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {q.text ? q.text.substring(0, 80) + (q.text.length > 80 ? "..." : "") : "Empty"}
                  </span>
                  {q.marks != null && (
                    <span className="text-xs text-muted-foreground shrink-0">[{q.marks} mk{q.marks !== 1 ? "s" : ""}]</span>
                  )}
                  {/* Per-question Save */}
                  {q.id && (
                    <Button
                      type="button"
                      variant={isSaved ? "default" : "outline"}
                      size="sm"
                      disabled={isSaving || isPending}
                      onClick={(e) => { e.stopPropagation(); handleSaveQuestion(i); }}
                      className={isSaved ? "bg-green-600 hover:bg-green-600 text-white" : ""}
                    >
                      {isSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isSaved ? (
                        <><Check className="h-3.5 w-3.5 mr-1" /> Saved</>
                      ) : (
                        <><Save className="h-3.5 w-3.5 mr-1" /> Save</>
                      )}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); removeQuestion(i); }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t p-3 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Q Number</Label>
                        <Input
                          value={q.questionNumber}
                          onChange={(e) => updateQuestionLocal(i, { questionNumber: e.target.value })}
                          className="text-sm"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Marks</Label>
                        <Input
                          type="number"
                          value={q.marks ?? ""}
                          onChange={(e) => updateQuestionLocal(i, { marks: e.target.value ? Number(e.target.value) : null })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Strand</Label>
                        {subject.toLowerCase() === "biology" ? (
                          <Select
                            value={q.topic || "__none__"}
                            onValueChange={(v) => updateQuestionLocal(i, { topic: v === "__none__" ? "" : v })}
                          >
                            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">Not set</SelectItem>
                              {BIOLOGY_STRANDS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={q.topic}
                            onChange={(e) => updateQuestionLocal(i, { topic: e.target.value })}
                            className="text-sm"
                            placeholder="e.g. Algebra"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Question Text</Label>
                      <Textarea
                        value={q.text}
                        onChange={(e) => updateQuestionLocal(i, { text: e.target.value })}
                        className="text-sm min-h-[80px]"
                        placeholder="Type or paste the question here..."
                      />
                    </div>

                    {/* Diagram image */}
                    {q.hasImage && q.imageUrl && (
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.imageUrl.startsWith("data:") ? q.imageUrl : encodeURI(q.imageUrl)}
                          alt={`Diagram for Q${q.questionNumber}`}
                          className="max-w-xs rounded border"
                        />
                        <label className="mt-1.5 inline-flex items-center gap-1 cursor-pointer text-sm px-3 py-1.5 border rounded-md hover:bg-muted/50 transition-colors">
                          <ImagePlus className="h-3.5 w-3.5" /> Replace Diagram
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                updateQuestionLocal(i, { hasImage: true, imageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {/* Add diagram for questions without one */}
                    {!q.hasImage && (
                      <label className="inline-flex items-center gap-1 cursor-pointer text-sm px-3 py-1.5 border rounded-md hover:bg-muted/50 transition-colors">
                        <ImagePlus className="h-3.5 w-3.5" /> Add Diagram
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              updateQuestionLocal(i, { hasImage: true, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}

                    <div>
                      <Label className="text-xs">Answer / Marking Scheme</Label>
                      <Textarea
                        value={q.answer}
                        onChange={(e) => updateQuestionLocal(i, { answer: e.target.value })}
                        className="text-sm min-h-[60px]"
                        placeholder="Expected answer or marking points..."
                      />
                    </div>

                    {/* Sub-questions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Sub-questions ({q.subQuestions.length})</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => addSubQuestion(i)}>
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                      {q.subQuestions.map((sq, si) => (
                        <div key={si} className="flex items-start gap-2 pl-4 border-l-2 border-muted">
                          <Input
                            value={sq.label}
                            onChange={(e) => updateSubQuestion(i, si, { label: e.target.value })}
                            className="w-12 text-xs text-center"
                          />
                          <Textarea
                            value={sq.text}
                            onChange={(e) => updateSubQuestion(i, si, { text: e.target.value })}
                            className="text-xs min-h-[40px] flex-1"
                            placeholder={`Part (${sq.label})...`}
                          />
                          <Input
                            type="number"
                            value={sq.marks ?? ""}
                            onChange={(e) => updateSubQuestion(i, si, { marks: e.target.value ? Number(e.target.value) : null })}
                            className="w-16 text-xs"
                            placeholder="mks"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSubQuestion(i, si)}>
                            <Trash2 className="h-3 w-3 text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Save button at the bottom of expanded content too */}
                    {q.id && (
                      <div className="flex justify-end pt-2 border-t">
                        <Button
                          type="button"
                          size="sm"
                          disabled={isSaving || isPending}
                          onClick={() => handleSaveQuestion(i)}
                          className={isSaved ? "bg-green-600 hover:bg-green-600 text-white" : ""}
                        >
                          {isSaving ? (
                            <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Saving...</>
                          ) : isSaved ? (
                            <><Check className="h-3.5 w-3.5 mr-1" /> Saved</>
                          ) : (
                            <><Save className="h-3.5 w-3.5 mr-1" /> Save Question</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {questions.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Another Question
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={pending || !subject || !gradeLevel || !examType}>
          {pending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {isEdit ? "Update Paper" : "Save Paper"}
        </Button>
      </div>
    </form>
  );
}
