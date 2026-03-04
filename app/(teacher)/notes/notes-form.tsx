"use client";

import { useState, useEffect, useActionState, useRef, useTransition, useCallback } from "react";
import { CascadeDropdown, type CascadeSelection } from "@/components/cbe/cascade-dropdown";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Check } from "lucide-react";
import { createTeachingNotes, updateTeachingNotes } from "./actions";

// ─── Types ───

interface NotesContent {
  introduction: string;
  keyConcepts: string;
  detailedExplanations: string;
  examples: string;
  studentActivities: string;
  assessmentQuestions: string;
  teacherTips: string;
}

interface NotesDefaults {
  id: string;
  title: string;
  gradeId: string;
  learningAreaId: string;
  strandId: string;
  subStrandId: string;
  noteType: string;
  content: NotesContent;
  status: string;
}

interface NotesFormProps {
  defaultGradeId?: string | null;
  defaults?: NotesDefaults;
  isEdit?: boolean;
}

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture Notes",
  discussion: "Discussion Guide",
  revision: "Revision Notes",
};

const EMPTY_CONTENT: NotesContent = {
  introduction: "",
  keyConcepts: "",
  detailedExplanations: "",
  examples: "",
  studentActivities: "",
  assessmentQuestions: "",
  teacherTips: "",
};

const SECTIONS: { key: keyof NotesContent; label: string; rows: number }[] = [
  { key: "introduction", label: "Introduction / Overview", rows: 4 },
  { key: "keyConcepts", label: "Key Concepts & Definitions", rows: 6 },
  { key: "detailedExplanations", label: "Detailed Explanations", rows: 8 },
  { key: "examples", label: "Examples & Illustrations", rows: 6 },
  { key: "studentActivities", label: "Student Activities", rows: 5 },
  { key: "assessmentQuestions", label: "Assessment Questions", rows: 5 },
  { key: "teacherTips", label: "Teacher's Tips / Common Misconceptions", rows: 4 },
];

// ─── Component ───

export function NotesForm({ defaultGradeId, defaults, isEdit }: NotesFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = isEdit ? updateTeachingNotes : createTeachingNotes;
  const [state, formAction] = useActionState(action, null);
  const [saving, startTransition] = useTransition();

  // Curriculum selection
  const [gradeId, setGradeId] = useState(defaults?.gradeId || "");
  const [learningAreaId, setLearningAreaId] = useState(defaults?.learningAreaId || "");
  const [strandId, setStrandId] = useState(defaults?.strandId || "");
  const [subStrandId, setSubStrandId] = useState(defaults?.subStrandId || "");
  const [cascadeNames, setCascadeNames] = useState<{
    grade?: string;
    learningArea?: string;
    strand?: string;
    subStrand?: string;
  }>({});

  // Form fields
  const [title, setTitle] = useState(defaults?.title || "");
  const [noteType, setNoteType] = useState(defaults?.noteType || "lecture");
  const [content, setContent] = useState<NotesContent>(
    defaults?.content || EMPTY_CONTENT
  );

  // AI generation
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Autosave
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  // Auto-title from cascade names
  useEffect(() => {
    if (!isEdit && cascadeNames.grade && cascadeNames.learningArea) {
      const parts = [cascadeNames.grade, cascadeNames.learningArea];
      if (cascadeNames.subStrand) parts.push(cascadeNames.subStrand);
      setTitle(parts.join(" — "));
    }
  }, [cascadeNames, isEdit]);

  // ─── AI Generate ───

  async function handleGenerate() {
    if (!gradeId || !learningAreaId || !strandId || !subStrandId) {
      setGenError("Please complete curriculum selection first.");
      return;
    }

    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeId,
          learningAreaId,
          strandId,
          subStrandId,
          noteType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGenError(data.error || "Generation failed.");
        return;
      }

      setContent(data.notes);
    } catch {
      setGenError("Failed to generate notes. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ─── Autosave ───

  const doAutoSave = useCallback(async () => {
    if (!isEdit || !defaults?.id || !formRef.current) return;

    setAutoSaveStatus("saving");
    const fd = new FormData(formRef.current);
    fd.set("status", "draft");

    try {
      const res = await fetch(`/api/notes/${defaults.id}/autosave`, {
        method: "PATCH",
        body: fd,
      });
      if (res.ok) {
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }
    } catch {
      setAutoSaveStatus("idle");
    }
  }, [isEdit, defaults?.id]);

  useEffect(() => {
    if (isEdit) {
      autoSaveTimer.current = setInterval(doAutoSave, 30000);
      return () => clearInterval(autoSaveTimer.current);
    }
  }, [isEdit, doAutoSave]);

  // ─── Save ───

  function handleSave(status: "draft" | "published") {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    fd.set("status", status);
    fd.set("content", JSON.stringify(content));

    if (isEdit && defaults?.id) {
      fd.set("id", defaults.id);
    }

    startTransition(() => formAction(fd));
  }

  // Update hidden content field
  function updateSection(key: keyof NotesContent, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const hasContent = Object.values(content).some((v) => v.trim().length > 0);
  const canSave = title && gradeId && learningAreaId && strandId && subStrandId && noteType;

  return (
    <form ref={formRef} action={formAction}>
      {/* Hidden fields for form submission */}
      <input type="hidden" name="gradeId" value={gradeId} />
      <input type="hidden" name="learningAreaId" value={learningAreaId} />
      <input type="hidden" name="strandId" value={strandId} />
      <input type="hidden" name="subStrandId" value={subStrandId} />
      <input type="hidden" name="noteType" value={noteType} />
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      {isEdit && defaults?.id && (
        <input type="hidden" name="id" value={defaults.id} />
      )}

      <div className="space-y-6">
        {/* Error display */}
        {(state as { error?: string })?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {(state as { error: string }).error}
          </div>
        )}

        {/* ═══ Curriculum Selection ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Curriculum Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CascadeDropdown
              defaultGradeId={defaults?.gradeId || defaultGradeId}
              defaultLearningAreaId={defaults?.learningAreaId}
              onChange={(sel: CascadeSelection) => {
                setGradeId(sel.gradeId || "");
                setLearningAreaId(sel.learningAreaId || "");
                setStrandId(sel.strandId || "");
                setSubStrandId(sel.subStrandId || "");
              }}
              onNamesChange={(names) => setCascadeNames(names)}
              showSLO={false}
            />
          </CardContent>
        </Card>

        {/* ═══ Note Details ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Note Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 7 — Mathematics — Integers"
                />
              </div>
              <div className="space-y-2">
                <Label>Note Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture Notes</SelectItem>
                    <SelectItem value="discussion">Discussion Guide</SelectItem>
                    <SelectItem value="revision">Revision Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !subStrandId}
                variant={hasContent ? "outline" : "default"}
              >
                {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {hasContent ? "Regenerate Notes" : "Generate Notes"}
              </Button>
              {!subStrandId && (
                <p className="text-xs text-muted-foreground">
                  Select curriculum above to enable generation
                </p>
              )}
            </div>
            {genError && (
              <p className="text-sm text-red-600">{genError}</p>
            )}
          </CardContent>
        </Card>

        {/* ═══ Content Sections ═══ */}
        {SECTIONS.map(({ key, label, rows }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={rows}
                value={content[key]}
                onChange={(e) => updateSection(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className="resize-y"
              />
            </CardContent>
          </Card>
        ))}

        {/* ═══ Save Actions ═══ */}
        <div className="flex items-center justify-between gap-3 sticky bottom-4 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {autoSaveStatus === "saving" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            )}
            {autoSaveStatus === "saved" && (
              <>
                <Check className="h-3.5 w-3.5 text-green-600" />
                Saved
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={saving || !canSave}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving || !canSave || !hasContent}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
