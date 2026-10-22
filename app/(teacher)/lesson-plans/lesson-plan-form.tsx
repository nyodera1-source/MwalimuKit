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
import { Eye, Loader2, CheckCircle, Info } from "lucide-react";

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

interface CurriculumSuggestions {
  objectives: string;
  keyInquiryQuestion: string;
  resources: string;
  activities: {
    introduction: string;
    development: string;
    conclusion: string;
  };
  assessment: {
    strategy: string;
    description: string;
  };
  competencyIds: string[];
}

const ASSESSMENT_STRATEGIES = [
  "Written",
  "Oral",
  "Practical",
  "Project",
  "Observation",
];

const DURATION_OPTIONS = [30, 40, 60, 80, 90, 120];

const LESSON_PLAN_STEPS = [
  "Choose curriculum",
  "Select competencies",
  "Review details",
  "Personalise content",
  "Review activities",
  "Finish assessment",
];

export function LessonPlanForm({
  teacherName,
  defaultGradeId,
  defaults,
}: LessonPlanFormProps) {
  const isEdit = !!defaults?.id;
  const action = isEdit ? updateLessonPlan : createLessonPlan;
  const [state, formAction, pending] = useActionState(action, null);

  // Cascade selection state (bridged to hidden inputs)
  const [gradeId, setGradeId] = useState(defaults?.gradeId || defaultGradeId || "");
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
  const [objectives, setObjectives] = useState(defaults?.content?.objectives || "");
  const [keyInquiryQuestion, setKeyInquiryQuestion] = useState(
    defaults?.content?.keyInquiryQuestion || ""
  );
  const [resources, setResources] = useState(defaults?.content?.resources || "");
  const [activitiesIntroduction, setActivitiesIntroduction] = useState(
    defaults?.content?.activities?.introduction || ""
  );
  const [activitiesDevelopment, setActivitiesDevelopment] = useState(
    defaults?.content?.activities?.development || ""
  );
  const [activitiesConclusion, setActivitiesConclusion] = useState(
    defaults?.content?.activities?.conclusion || ""
  );
  const [assessmentDescription, setAssessmentDescription] = useState(
    defaults?.content?.assessmentDescription || ""
  );
  const [duration, setDuration] = useState(
    String(defaults?.content?.duration || "40")
  );
  const [isTemplate, setIsTemplate] = useState(defaults?.isTemplate || false);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track cascade names for auto-title
  const [cascadeNames, setCascadeNames] = useState<{
    grade?: string;
    learningArea?: string;
    strand?: string;
    subStrand?: string;
  }>({});
  const generatedTitle = [
    cascadeNames.grade,
    cascadeNames.learningArea,
    cascadeNames.strand,
    cascadeNames.subStrand,
  ]
    .filter(Boolean)
    .join(" - ");
  const displayedTitle = autoTitle && generatedTitle ? generatedTitle : title;

  // Curriculum selections drive the default lesson content. Existing plans are
  // left untouched so editing never overwrites a teacher's custom work.
  const selectedSloKey = sloIds.join(",");
  useEffect(() => {
    if (!subStrandId) return;
    const query = new URLSearchParams({ subStrandId });
    if (selectedSloKey) query.set("sloIds", selectedSloKey);

    fetch(`/api/curriculum/suggestions?${query.toString()}`)
      .then((r) => r.json() as Promise<CurriculumSuggestions>)
      .then((data) => {
        if (isEdit || sloIds.length === 0) return;
        setObjectives(data.objectives || "");
        setKeyInquiryQuestion(data.keyInquiryQuestion || "");
        setResources(data.resources || "");
        setActivitiesIntroduction(data.activities?.introduction || "");
        setActivitiesDevelopment(data.activities?.development || "");
        setActivitiesConclusion(data.activities?.conclusion || "");
        setAssessmentStrategy(data.assessment?.strategy || "");
        setAssessmentDescription(data.assessment?.description || "");
        if (competencyIds.length === 0 && data.competencyIds?.length) {
          setCompetencyIds(data.competencyIds);
        }
      })
      .catch(() => undefined);
  }, [subStrandId, selectedSloKey, isEdit, competencyIds.length, sloIds.length]);

  // Auto-save for existing plans (every 30 seconds)
  const planId = defaults?.id;
  const doAutoSave = useCallback(async () => {
    if (!isEdit || !planId || !formRef.current) return;

    setAutoSaveStatus("saving");
    try {
      const fd = new FormData(formRef.current);
      fd.set("status", "draft");
      const res = await fetch(`/api/lesson-plans/${planId}/autosave`, {
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
  }, [isEdit, planId]);

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

      <div className="flex items-start gap-3 rounded-lg border border-blue-300 bg-blue-100 px-5 py-4 text-blue-950 shadow-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <div>
          <p className="font-semibold">Your lesson plan is ready to customise.</p>
          <p className="mt-1 text-sm leading-6">
            Curriculum content has been pre-filled for you. Review each section and edit, add to, or remove any suggested content to suit your class. Reflection can be completed after the lesson.
          </p>
        </div>
      </div>

      <nav
        aria-label="Lesson plan steps"
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
      >
        <ol className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-6 md:gap-2">
          {LESSON_PLAN_STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {index + 1}
              </span>
              <span className="leading-tight">{step}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Step 1: Choose curriculum */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Choose your curriculum</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the grade, learning area, strand, sub-strand, and learning outcomes for this lesson.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <CascadeDropdown
            defaultGradeId={defaults?.gradeId || defaultGradeId}
            defaultLearningAreaId={defaults?.learningAreaId}
            defaultStrandId={defaults?.strandId}
            defaultSubStrandId={defaults?.subStrandId}
            defaultSloIds={defaults?.sloIds}
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

          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            <p className="font-medium">2. Select the relevant core competencies</p>
            <p className="mt-1">
              Choose the competencies that best support this strand and the selected learning outcomes.
            </p>
          </div>

          <div className="pt-4 border-t">
            <CompetencyCheckboxGroup
              selectedIds={competencyIds}
              onChange={setCompetencyIds}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Review lesson details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Review your lesson details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Check the pre-filled title, teacher name, date, and lesson duration.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                name="title"
                value={displayedTitle}
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

      {/* Step 4: Personalise lesson content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">4. Review and personalise the lesson content</CardTitle>
          <p className="text-sm text-muted-foreground">
            The curriculum has filled these fields for you. Edit, add to, or remove any suggested content to suit your class.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="objectives">Lesson Objectives</Label>
            </div>
            <Textarea
              id="objectives"
              name="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="By the end of the lesson, the learner should be able to..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="keyInquiryQuestion">Key Inquiry Question</Label>
            </div>
            <Input
              id="keyInquiryQuestion"
              name="keyInquiryQuestion"
              value={keyInquiryQuestion}
              onChange={(e) => setKeyInquiryQuestion(e.target.value)}
              placeholder="What question drives this lesson?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="resources">Learning Resources</Label>
              </div>
              <Textarea
                id="resources"
                name="resources"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="Textbooks, charts, models, etc."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="digitalResources">Digital Resources (optional)</Label>
              <Textarea
                id="digitalResources"
                name="digitalResources"
                defaultValue={content.digitalResources}
                placeholder="Add a video, app, website, or other digital tool if needed."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Review activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5. Review the teaching and learning activities</CardTitle>
          <p className="text-sm text-muted-foreground">
            Check the suggested introduction, main activity, and conclusion. Adapt, add to, or remove steps as needed.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="activitiesIntroduction">
                Introduction
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                5-10 min
              </Badge>
              </Label>
            </div>
            <Textarea
              id="activitiesIntroduction"
              name="activitiesIntroduction"
              value={activitiesIntroduction}
              onChange={(e) => setActivitiesIntroduction(e.target.value)}
              placeholder="How will you introduce the lesson? Prior knowledge activation, motivation..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="activitiesDevelopment">
                Development
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Main activity
              </Badge>
              </Label>
            </div>
            <Textarea
              id="activitiesDevelopment"
              name="activitiesDevelopment"
              value={activitiesDevelopment}
              onChange={(e) => setActivitiesDevelopment(e.target.value)}
              placeholder="Step-by-step teaching and learning activities..."
              rows={5}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="activitiesConclusion">
                Conclusion
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                5-10 min
              </Badge>
              </Label>
            </div>
            <Textarea
              id="activitiesConclusion"
              name="activitiesConclusion"
              value={activitiesConclusion}
              onChange={(e) => setActivitiesConclusion(e.target.value)}
              placeholder="Wrap-up, summary, homework assignment..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step 6: Review assessment and reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">6. Review assessment and reflection</CardTitle>
          <p className="text-sm text-muted-foreground">
            Confirm the assessment details. Reflection can be completed after teaching the lesson.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Assessment Strategy</Label>
              </div>
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
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="assessmentDescription">Assessment Details</Label>
              </div>
              <Textarea
                id="assessmentDescription"
                name="assessmentDescription"
                value={assessmentDescription}
                onChange={(e) => setAssessmentDescription(e.target.value)}
                placeholder="Describe how you will assess learners..."
                rows={3}
              />
            </div>
          </div>

          {!isEdit ? (
            <input type="hidden" name="reflection" value="" />
          ) : (
            <div>
              <Label htmlFor="reflection">
                Reflection
                <span className="text-muted-foreground text-xs ml-2">
                  (Complete after lesson delivery)
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
          )}
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
                Preview and Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
