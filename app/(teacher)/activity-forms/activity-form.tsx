"use client";

import { useState, useRef, useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Check } from "lucide-react";
import { createActivityForm, updateActivityForm } from "./actions";

// ─── Types ───

interface ExperimentData {
  id: string;
  name: string;
  subject: string;
  gradeId: string;
  learningAreaId: string;
  aim: string;
  materials: string[];
  procedure: string[];
  safetyNotes: string[];
  expectedResults: string;
  relatedConcepts: string[];
  grade: { name: string };
  learningArea: { name: string };
}

interface ActivityFormDefaults {
  id: string;
  title: string | null;
  activityDate: Date;
  classGroup: string | null;
  observations: string | null;
  results: string | null;
  teacherNotes: string | null;
  status: string;
}

interface ActivityFormProps {
  experiment: ExperimentData;
  defaults?: ActivityFormDefaults;
  isEdit?: boolean;
}

// ─── Component ───

export function ActivityForm({ experiment, defaults, isEdit }: ActivityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = isEdit ? updateActivityForm : createActivityForm;
  const [state, formAction] = useActionState(action, null);
  const [saving, startTransition] = useTransition();

  // Form fields
  const [title, setTitle] = useState(
    defaults?.title || `${experiment.name} - ${new Date().toLocaleDateString("en-KE")}`
  );
  const [activityDate, setActivityDate] = useState(
    defaults?.activityDate
      ? new Date(defaults.activityDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [classGroup, setClassGroup] = useState(defaults?.classGroup || "");
  const [observations, setObservations] = useState(defaults?.observations || "");
  const [results, setResults] = useState(defaults?.results || "");
  const [teacherNotes, setTeacherNotes] = useState(defaults?.teacherNotes || "");

  // Save handler
  function handleSave(status: "draft" | "completed") {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    fd.set("status", status);

    if (isEdit && defaults?.id) {
      fd.set("id", defaults.id);
    }

    startTransition(() => formAction(fd));
  }

  const canSave = activityDate;

  return (
    <form ref={formRef} action={formAction}>
      {/* Hidden fields */}
      <input type="hidden" name="experimentId" value={experiment.id} />
      <input type="hidden" name="gradeId" value={experiment.gradeId} />
      <input type="hidden" name="learningAreaId" value={experiment.learningAreaId} />
      {isEdit && defaults?.id && <input type="hidden" name="id" value={defaults.id} />}

      <div className="space-y-6">
        {/* Error display */}
        {(state as { error?: string })?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {(state as { error: string }).error}
          </div>
        )}

        {/* ═══ Experiment Details ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{experiment.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {experiment.grade.name} • {experiment.learningArea.name}
                </p>
              </div>
              <Badge>{experiment.subject}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Aim</h4>
              <p className="text-sm">{experiment.aim}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">
                Materials ({experiment.materials.length})
              </h4>
              <ul className="list-disc list-inside text-sm space-y-0.5">
                {experiment.materials.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">
                Procedure ({experiment.procedure.length} steps)
              </h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {experiment.procedure.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    {step.replace(/^\d+\.\s*/, "")}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1 text-red-600">
                Safety Notes ({experiment.safetyNotes.length})
              </h4>
              <ul className="list-disc list-inside text-sm space-y-0.5 text-red-900">
                {experiment.safetyNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">Related Concepts</h4>
              <div className="flex flex-wrap gap-1">
                {experiment.relatedConcepts.map((concept, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Activity Details ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Custom title for this activity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityDate">Activity Date *</Label>
                <Input
                  id="activityDate"
                  name="activityDate"
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classGroup">Class/Group (optional)</Label>
              <Input
                id="classGroup"
                name="classGroup"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                placeholder="e.g., Form 2 East, Grade 8A"
              />
            </div>
          </CardContent>
        </Card>

        {/* ═══ Observations & Results ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observations & Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                name="observations"
                rows={5}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Record what students observed during the experiment..."
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results</Label>
              <Textarea
                id="results"
                name="results"
                rows={4}
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Summary of results obtained..."
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherNotes">Teacher Notes</Label>
              <Textarea
                id="teacherNotes"
                name="teacherNotes"
                rows={4}
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="Additional notes for yourself..."
                className="resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* ═══ Save Actions ═══ */}
        <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-lg">
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
            Save
          </Button>
          <Button
            type="button"
            onClick={() => handleSave("completed")}
            disabled={saving || !canSave}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Finish
          </Button>
        </div>
      </div>
    </form>
  );
}
