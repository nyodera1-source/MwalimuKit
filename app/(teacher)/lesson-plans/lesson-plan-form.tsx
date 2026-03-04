"use client";

import { useActionState, useState, useEffect, useRef, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CascadeDropdown } from "@/components/cbe/cascade-dropdown";
import { CompetencyCheckboxGroup } from "@/components/cbe/competency-checkbox-group";
import { createLessonPlan, updateLessonPlan } from "./actions";
import { Eye, Loader2, CheckCircle, Lightbulb, Wand2 } from "lucide-react";

interface LessonPlanContent {
  date?: string;
  duration?: number;
  objectives?: string;
  keyInquiryQuestion?: string;
  resources?: string;
  digitalResources?: string;
  activities?: {
    introduction?: string;
    development?: string;
    conclusion?: string;
  };
  assessmentStrategy?: string;
  assessmentDescription?: string;
  reflection?: string;
}

interface LessonPlanDefaults {
  id?: string;
  title?: string;
  gradeId?: string;
  learningAreaId?: string;
  strandId?: string;
  subStrandId?: string;
  sloIds?: string[];
  competencyIds?: string[];
  content?: LessonPlanContent;
  status?: string;
  isTemplate?: boolean;
}

interface LessonPlanFormProps {
  teacherName: string;
  defaultGradeId?: string | null;
  defaults?: LessonPlanDefaults;
}

interface Suggestions {
  objectives: string;
  keyInquiryQuestion: string;
  resources: string;
}

const ASSESSMENT_STRATEGIES = [
  "Written",
  "Oral",
  "Practical",
  "Project",
  "Observation",
];

const DURATION_OPTIONS = [30, 40, 60, 80, 90, 120];

export function LessonPlanForm({
  teacherName,
  defaultGradeId,
  defaults,
}: LessonPlanFormProps) {
  const isEdit = !!defaults?.id;
  const action = isEdit ? updateLessonPlan : createLessonPlan;
  const [state, formAction, pending] = useActionState(action, null);

  // Cascade selection state (bridged to hidden inputs)
  const [gradeId, setGradeId] = useState(defaults?.gradeId || "");
  const [learningAreaId, setLearningAreaId] = useState(defaults?.learningAreaId || "");
  const [strandId, setStrandId] = useState(defaults?.strandId || "");
  const [subStrandId, setSubStrandId] = useState(defaults?.subStrandId || "");
  const [sloIds, setSloIds] = useState<string[]>(defaults?.sloIds || []);
  const [competencyIds, setCompetencyIds] = useState<string[]>(defaults?.competencyIds || []);

  // Form field state
  const [title, setTitle] = useState(defaults?.title || "");
  const [autoTitle, setAutoTitle] = useState(!defaults?.title);
  const [assessmentStrategy, setAssessmentStrategy] = useState(
    defaults?.content?.assessmentStrategy || ""
  );
  const [duration, setDuration] = useState(
    String(defaults?.content?.duration || "40")
  );
  const [isTemplate, setIsTemplate] = useState(defaults?.isTemplate || false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // AI generation state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Refs for suggestion application and AI population
  const objectivesRef = useRef<HTMLTextAreaElement>(null);
  const inquiryRef = useRef<HTMLInputElement>(null);
  const resourcesRef = useRef<HTMLTextAreaElement>(null);
  const digitalResourcesRef = useRef<HTMLTextAreaElement>(null);
  const introductionRef = useRef<HTMLTextAreaElement>(null);
  const developmentRef = useRef<HTMLTextAreaElement>(null);
  const conclusionRef = useRef<HTMLTextAreaElement>(null);
  const assessmentDescRef = useRef<HTMLTextAreaElement>(null);

  // Track cascade names for auto-title
  const [cascadeNames, setCascadeNames] = useState<{
    grade?: string;
    learningArea?: string;
    strand?: string;
  }>({});

  // Auto-generate title from cascade selection
  useEffect(() => {
    if (autoTitle && cascadeNames.grade && cascadeNames.learningArea) {
      const parts = [cascadeNames.grade, cascadeNames.learningArea];
      if (cascadeNames.strand) parts.push(cascadeNames.strand);
      setTitle(parts.join(" - "));
    }
  }, [autoTitle, cascadeNames]);

  // Fetch suggestions when sub-strand changes
  useEffect(() => {
    if (!subStrandId) {
      setSuggestions(null);
      return;
    }
    fetch(`/api/curriculum/suggestions?subStrandId=${subStrandId}`)
      .then((r) => r.json())
      .then((data) => {
        setSuggestions({
          objectives: data.objectives || "",
          keyInquiryQuestion: data.keyInquiryQuestion || "",
          resources: data.resources || "",
        });
        // Auto-show suggestions for new plans
        if (!isEdit) setShowSuggestions(true);
      })
      .catch(() => setSuggestions(null));
  }, [subStrandId, isEdit]);

  // Apply a suggestion to a field
  const applySuggestion = (field: "objectives" | "keyInquiryQuestion" | "resources") => {
    if (!suggestions) return;
    const value = suggestions[field];
    if (field === "objectives" && objectivesRef.current) {
      objectivesRef.current.value = value;
    } else if (field === "keyInquiryQuestion" && inquiryRef.current) {
      inquiryRef.current.value = value;
    } else if (field === "resources" && resourcesRef.current) {
      resourcesRef.current.value = value;
    }
    // Trigger change event for React
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      field === "keyInquiryQuestion" ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    const el = field === "objectives" ? objectivesRef.current
      : field === "keyInquiryQuestion" ? inquiryRef.current
      : resourcesRef.current;
    if (el && nativeInputValueSetter) {
      nativeInputValueSetter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  const applyAllSuggestions = () => {
    applySuggestion("objectives");
    applySuggestion("keyInquiryQuestion");
    applySuggestion("resources");
    setShowSuggestions(false);
  };

  // Helper to set a field value via native setter (triggers React change events)
  function setFieldValue(
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
    value: string,
    isInput = false
  ) {
    if (!ref.current || !value) return;
    const proto = isInput
      ? HTMLInputElement.prototype
      : HTMLTextAreaElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) {
      setter.call(ref.current, value);
      ref.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  // Generate entire lesson plan with AI
  const generateWithAI = async () => {
    if (!subStrandId) return;
    setAiGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/lesson-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeId,
          learningAreaId,
          strandId,
          subStrandId,
          sloIds: sloIds.length > 0 ? sloIds : undefined,
          competencyIds: competencyIds.length > 0 ? competencyIds : undefined,
          duration: Number(duration),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }
      const { plan } = await res.json();
      // Populate all fields
      setFieldValue(objectivesRef, plan.objectives);
      setFieldValue(inquiryRef, plan.keyInquiryQuestion, true);
      setFieldValue(resourcesRef, plan.resources);
      setFieldValue(digitalResourcesRef, plan.digitalResources);
      setFieldValue(introductionRef, plan.activitiesIntroduction);
      setFieldValue(developmentRef, plan.activitiesDevelopment);
      setFieldValue(conclusionRef, plan.activitiesConclusion);
      setFieldValue(assessmentDescRef, plan.assessmentDescription);
      if (plan.assessmentStrategy) setAssessmentStrategy(plan.assessmentStrategy);
      setShowSuggestions(false);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setAiGenerating(false);
    }
  };

  // Auto-save for existing plans (every 30 seconds)
  const doAutoSave = useCallback(async () => {
    if (!isEdit || !defaults?.id || !formRef.current) return;

    setAutoSaveStatus("saving");
    try {
      const fd = new FormData(formRef.current);
      fd.set("status", "draft");
      const res = await fetch(`/api/lesson-plans/${defaults.id}/autosave`, {
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
      return () => {
        if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
      };
    }
  }, [isEdit, doAutoSave]);

  // Scroll to error when validation fails
  useEffect(() => {
    if (state?.error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state?.error]);

  const content = defaults?.content || {};
  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Hidden fields for server action */}
      {isEdit && <input type="hidden" name="id" value={defaults!.id} />}
      <input type="hidden" name="gradeId" value={gradeId} />
      <input type="hidden" name="learningAreaId" value={learningAreaId} />
      <input type="hidden" name="strandId" value={strandId} />
      <input type="hidden" name="subStrandId" value={subStrandId} />
      {sloIds.map((id) => (
        <input key={id} type="hidden" name="sloIds" value={id} />
      ))}
      {competencyIds.map((id) => (
        <input key={id} type="hidden" name="competencyIds" value={id} />
      ))}
      <input type="hidden" name="status" value="draft" />
      <input type="hidden" name="isTemplate" value={String(isTemplate)} />
      <input type="hidden" name="assessmentStrategy" value={assessmentStrategy} />
      <input type="hidden" name="duration" value={duration} />

      {/* Error message */}
      {state?.error && (
        <div ref={errorRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      {/* Auto-save indicator */}
      {isEdit && autoSaveStatus !== "idle" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {autoSaveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          )}
          {autoSaveStatus === "saved" && (
            <>
              <CheckCircle className="h-3 w-3 text-green-500" />
              Saved
            </>
          )}
        </div>
      )}

      {/* Section 1: Curriculum Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Curriculum Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CascadeDropdown
            defaultGradeId={defaults?.gradeId || defaultGradeId}
            defaultLearningAreaId={defaults?.learningAreaId}
            onChange={(sel) => {
              setGradeId(sel.gradeId || "");
              setLearningAreaId(sel.learningAreaId || "");
              setStrandId(sel.strandId || "");
              setSubStrandId(sel.subStrandId || "");
              setSloIds(sel.sloIds || []);
            }}
            onNamesChange={(names) => setCascadeNames(names)}
            showSLO={true}
          />

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">
              Core Competencies
            </Label>
            <CompetencyCheckboxGroup
              selectedIds={competencyIds}
              onChange={setCompetencyIds}
            />
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Banner */}
      {suggestions && showSuggestions && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  Suggestions based on your curriculum selection
                </p>
                <p className="text-xs text-blue-700">
                  We can pre-fill objectives, inquiry question and resources based on the selected SLOs. You can edit them after.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={applyAllSuggestions}
                  >
                    Apply All Suggestions
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSuggestions(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generation Banner */}
      {subStrandId && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Wand2 className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-purple-900">
                  Generate complete lesson plan with AI
                </p>
                <p className="text-xs text-purple-700">
                  AI will fill in objectives, activities, resources, and assessment based on the selected curriculum and SLOs. You can edit everything after.
                </p>
                {aiError && (
                  <p className="text-xs text-red-600">{aiError}</p>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={generateWithAI}
                  disabled={aiGenerating}
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Lesson Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setAutoTitle(false);
                }}
                placeholder="e.g., Grade 4 - Mathematics - Numbers"
              />
            </div>
            <div>
              <Label htmlFor="teacherName">Teacher Name</Label>
              <Input
                id="teacherName"
                value={teacherName}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={content.date || today}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lesson Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="objectives">Lesson Objectives</Label>
              {suggestions && !showSuggestions && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-blue-600"
                  onClick={() => applySuggestion("objectives")}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Suggest
                </Button>
              )}
            </div>
            <Textarea
              ref={objectivesRef}
              id="objectives"
              name="objectives"
              defaultValue={content.objectives}
              placeholder="By the end of the lesson, the learner should be able to..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="keyInquiryQuestion">Key Inquiry Question</Label>
              {suggestions && !showSuggestions && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-blue-600"
                  onClick={() => applySuggestion("keyInquiryQuestion")}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Suggest
                </Button>
              )}
            </div>
            <Input
              ref={inquiryRef}
              id="keyInquiryQuestion"
              name="keyInquiryQuestion"
              defaultValue={content.keyInquiryQuestion}
              placeholder="What question drives this lesson?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="resources">Learning Resources</Label>
                {suggestions && !showSuggestions && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-blue-600"
                    onClick={() => applySuggestion("resources")}
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Suggest
                  </Button>
                )}
              </div>
              <Textarea
                ref={resourcesRef}
                id="resources"
                name="resources"
                defaultValue={content.resources}
                placeholder="Textbooks, charts, models, etc."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="digitalResources">Digital Resources</Label>
              <Textarea
                ref={digitalResourcesRef}
                id="digitalResources"
                name="digitalResources"
                defaultValue={content.digitalResources}
                placeholder="Videos, apps, websites, etc."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Teaching & Learning Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teaching & Learning Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="activitiesIntroduction">
              Introduction
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                5-10 min
              </Badge>
            </Label>
            <Textarea
              ref={introductionRef}
              id="activitiesIntroduction"
              name="activitiesIntroduction"
              defaultValue={content.activities?.introduction}
              placeholder="How will you introduce the lesson? Prior knowledge activation, motivation..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="activitiesDevelopment">
              Development
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Main activity
              </Badge>
            </Label>
            <Textarea
              ref={developmentRef}
              id="activitiesDevelopment"
              name="activitiesDevelopment"
              defaultValue={content.activities?.development}
              placeholder="Step-by-step teaching and learning activities..."
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="activitiesConclusion">
              Conclusion
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                5-10 min
              </Badge>
            </Label>
            <Textarea
              ref={conclusionRef}
              id="activitiesConclusion"
              name="activitiesConclusion"
              defaultValue={content.activities?.conclusion}
              placeholder="Wrap-up, summary, homework assignment..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Assessment & Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment & Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Assessment Strategy</Label>
              <Select
                value={assessmentStrategy}
                onValueChange={setAssessmentStrategy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_STRATEGIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assessmentDescription">Assessment Details</Label>
              <Textarea
                ref={assessmentDescRef}
                id="assessmentDescription"
                name="assessmentDescription"
                defaultValue={content.assessmentDescription}
                placeholder="Describe how you will assess learners..."
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reflection">
              Reflection
              <span className="text-muted-foreground text-xs ml-2">
                (Fill after lesson delivery)
              </span>
            </Label>
            <Textarea
              id="reflection"
              name="reflection"
              defaultValue={content.reflection}
              placeholder="What went well? What would you change? Were objectives met?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
              {state.error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isTemplate"
                checked={isTemplate}
                onCheckedChange={(checked) => setIsTemplate(checked === true)}
              />
              <Label htmlFor="isTemplate" className="text-sm font-normal">
                Save as reusable template
              </Label>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              <Button
                type="submit"
                disabled={pending}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Save & Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
