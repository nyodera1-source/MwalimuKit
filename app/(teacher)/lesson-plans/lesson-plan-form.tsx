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
import { Eye, Loader2, CheckCircle, Info, RotateCcw } from "lucide-react";

interface LessonPlanContent {
  date?: string;
  duration?: number;
  schoolName?: string;
  classGroup?: string;
  time?: string;
  lessonFocus?: string;
  lessonNumber?: number;
  lessonCount?: number;
  priorKnowledge?: string;
  vocabulary?: string;
  teacherPreparation?: string;
  valuesAndPcis?: string;
  safetyNotes?: string;
  differentiation?: string;
  homework?: string;
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
  defaultSchoolName?: string | null;
  defaultGradeId?: string | null;
  defaults?: LessonPlanDefaults;
}

interface CurriculumSuggestions {
  objectives: string;
  keyInquiryQuestion: string;
  resources: string;
  lessonFocus?: string;
  lessonNumber?: number;
  lessonCount?: number;
  priorKnowledge?: string;
  vocabulary?: string;
  teacherPreparation?: string;
  valuesAndPcis?: string;
  safetyNotes?: string;
  differentiation?: string;
  homework?: string;
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
  "Choose topic",
  "Confirm settings",
  "Preview and download",
];

export function LessonPlanForm({
  teacherName,
  defaultSchoolName,
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
  const [schoolName, setSchoolName] = useState(
    defaults?.content?.schoolName || defaultSchoolName || ""
  );
  const [classGroup, setClassGroup] = useState(defaults?.content?.classGroup || "");
  const [time, setTime] = useState(defaults?.content?.time || "");
  const [lessonFocus, setLessonFocus] = useState(defaults?.content?.lessonFocus || "");
  const [lessonNumber, setLessonNumber] = useState(
    String(defaults?.content?.lessonNumber || 1)
  );
  const [lessonCount, setLessonCount] = useState(
    String(defaults?.content?.lessonCount || 1)
  );
  const [priorKnowledge, setPriorKnowledge] = useState(
    defaults?.content?.priorKnowledge || ""
  );
  const [vocabulary, setVocabulary] = useState(defaults?.content?.vocabulary || "");
  const [teacherPreparation, setTeacherPreparation] = useState(
    defaults?.content?.teacherPreparation || ""
  );
  const [valuesAndPcis, setValuesAndPcis] = useState(
    defaults?.content?.valuesAndPcis || ""
  );
  const [safetyNotes, setSafetyNotes] = useState(defaults?.content?.safetyNotes || "");
  const [differentiation, setDifferentiation] = useState(
    defaults?.content?.differentiation || ""
  );
  const [homework, setHomework] = useState(defaults?.content?.homework || "");
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
  const [isPreparingCurriculum, setIsPreparingCurriculum] = useState(false);
  const [curriculumSnapshot, setCurriculumSnapshot] = useState<CurriculumSuggestions | null>(null);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const preferencesLoaded = useRef(false);

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
  const applyCurriculumSuggestions = useCallback(
    (data: CurriculumSuggestions, replaceCompetencies = false) => {
      setLessonFocus(data.lessonFocus || "");
      setLessonNumber(String(data.lessonNumber || 1));
      setLessonCount(String(data.lessonCount || 1));
      setPriorKnowledge(data.priorKnowledge || "");
      setVocabulary(data.vocabulary || "");
      setTeacherPreparation(data.teacherPreparation || "");
      setValuesAndPcis(data.valuesAndPcis || "");
      setSafetyNotes(data.safetyNotes || "");
      setDifferentiation(data.differentiation || "");
      setHomework(data.homework || "");
      setObjectives(data.objectives || "");
      setKeyInquiryQuestion(data.keyInquiryQuestion || "");
      setResources(data.resources || "");
      setActivitiesIntroduction(data.activities?.introduction || "");
      setActivitiesDevelopment(data.activities?.development || "");
      setActivitiesConclusion(data.activities?.conclusion || "");
      setAssessmentStrategy(data.assessment?.strategy || "");
      setAssessmentDescription(data.assessment?.description || "");
      if (replaceCompetencies || competencyIds.length === 0) {
        setCompetencyIds(data.competencyIds || []);
      }
    },
    [competencyIds.length]
  );

  const loadCurriculumSuggestions = useCallback(
    async (replaceCurrentContent = false) => {
      if (!subStrandId || sloIds.length === 0) return;

      setIsPreparingCurriculum(true);
      const query = new URLSearchParams({ subStrandId, duration, lessonNumber });
      if (selectedSloKey) query.set("sloIds", selectedSloKey);

      try {
        const response = await fetch(`/api/curriculum/suggestions?${query.toString()}`);
        if (!response.ok) throw new Error("Could not load curriculum suggestions");
        const data = (await response.json()) as CurriculumSuggestions;
        setCurriculumSnapshot(data);
        if (replaceCurrentContent || !isEdit) {
          applyCurriculumSuggestions(data, replaceCurrentContent);
        }
      } catch {
        // Keep the existing content available if a refresh is temporarily unavailable.
      } finally {
        setIsPreparingCurriculum(false);
      }
    },
    [applyCurriculumSuggestions, duration, isEdit, lessonNumber, selectedSloKey, sloIds.length, subStrandId]
  );

  useEffect(() => {
    if (!subStrandId || isEdit || sloIds.length === 0) return;
    void loadCurriculumSuggestions();
  }, [isEdit, loadCurriculumSuggestions, sloIds.length, subStrandId]);

  // Remember only practical, non-sensitive preferences for the next lesson plan.
  useEffect(() => {
    if (isEdit || preferencesLoaded.current) return;
    try {
      const saved = JSON.parse(localStorage.getItem("mwalimukit.lesson-plan-preferences") || "null") as {
        classGroup?: string;
        time?: string;
        duration?: string;
        assessmentStrategy?: string;
      } | null;
      if (saved?.classGroup && !defaults?.content?.classGroup) setClassGroup(saved.classGroup);
      if (saved?.time && !defaults?.content?.time) setTime(saved.time);
      if (saved?.duration && !defaults?.content?.duration) setDuration(saved.duration);
      if (saved?.assessmentStrategy && !defaults?.content?.assessmentStrategy) {
        setAssessmentStrategy(saved.assessmentStrategy);
      }
    } catch {
      // Ignore unavailable or malformed browser storage.
    }
    preferencesLoaded.current = true;
  }, [defaults?.content?.assessmentStrategy, defaults?.content?.classGroup, defaults?.content?.duration, defaults?.content?.time, isEdit]);

  useEffect(() => {
    if (isEdit || !preferencesLoaded.current) return;
    localStorage.setItem(
      "mwalimukit.lesson-plan-preferences",
      JSON.stringify({ classGroup, time, duration, assessmentStrategy })
    );
  }, [assessmentStrategy, classGroup, duration, isEdit, time]);

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
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const lessonTotal = Number(lessonCount) || 1;

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
      <input type="hidden" name="lessonNumber" value={lessonNumber} />
      <input type="hidden" name="lessonCount" value={lessonCount} />

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
          <p className="font-semibold">Your lesson plan is prepared from the curriculum.</p>
          <p className="mt-1 text-sm leading-6">
            Choose the topic and confirm a few settings. The system will prepare the lesson content for you. You can review or customise it before downloading.
          </p>
        </div>
      </div>

      <nav
        aria-label="Lesson plan steps"
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
      >
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
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

      {/* Step 1: Choose lesson topic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Choose the lesson topic</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the topic for this lesson. The curriculum outcomes and suggested content will be included automatically.
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
            showSLO={false}
            autoSelectSLO={true}
          />

          <details className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-slate-800">
              Adjust core competencies (optional)
            </summary>
            <p className="mb-3 mt-2 text-sm text-muted-foreground">
              Relevant competencies are suggested from the selected curriculum outcomes.
            </p>
            <CompetencyCheckboxGroup
              selectedIds={competencyIds}
              onChange={setCompetencyIds}
            />
          </details>
        </CardContent>
      </Card>

      {/* Step 2: Confirm lesson settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. Confirm lesson settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Most details are pre-filled. Change only what is specific to this class or lesson.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schoolName">School</Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="School name"
              />
            </div>
            <div>
              <Label htmlFor="classGroup">Class or stream (optional)</Label>
              <Input
                id="classGroup"
                name="classGroup"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                placeholder="e.g., Grade 10 East"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <Label htmlFor="title">Lesson title</Label>
                {autoTitle && <Badge variant="outline" className="text-xs font-normal">From curriculum</Badge>}
              </div>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
            <div>
              <Label htmlFor="time">Time (optional)</Label>
              <Input
                id="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 8:00-8:40 a.m."
              />
            </div>
            <div>
              <Label htmlFor="lessonNumber">Lesson number</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="lessonNumber"
                  type="number"
                  min={1}
                  max={lessonTotal}
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(e.target.value)}
                  className="w-20"
                />
                <Badge variant="outline" className="font-normal">of {lessonTotal}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">The curriculum suggests {lessonTotal} lesson{lessonTotal === 1 ? "" : "s"} for this sub-strand.</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Optional generated content review */}
      <details open={isEdit} className="group rounded-xl border bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-6 py-5 [&::-webkit-details-marker]:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">3. Review generated content <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The system has prepared these sections from the selected outcomes. Open this area only if you want to edit them.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {curriculumSnapshot && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Curriculum prepared</Badge>}
              <Badge variant="outline">Optional review</Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadCurriculumSuggestions(true)}
                disabled={isPreparingCurriculum || !subStrandId || sloIds.length === 0}
              >
                {isPreparingCurriculum ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                Restore curriculum suggestions
              </Button>
            </div>
          </div>
        </summary>
        <div className="space-y-6 border-t p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lesson content</CardTitle>
              <p className="text-sm text-muted-foreground">
                Edit, add to, or remove any suggested content to suit your class. The original curriculum suggestions can be restored above.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lessonFocus">Lesson focus</Label>
              <Input
                id="lessonFocus"
                name="lessonFocus"
                value={lessonFocus}
                onChange={(e) => setLessonFocus(e.target.value)}
                placeholder="The main focus of this lesson"
              />
            </div>
            <div>
              <Label htmlFor="vocabulary">Key vocabulary</Label>
              <Input
                id="vocabulary"
                name="vocabulary"
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
                placeholder="Important terms for the lesson"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priorKnowledge">Prior knowledge</Label>
              <Textarea
                id="priorKnowledge"
                name="priorKnowledge"
                value={priorKnowledge}
                onChange={(e) => setPriorKnowledge(e.target.value)}
                placeholder="What learners should already know"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="teacherPreparation">Teacher preparation</Label>
              <Textarea
                id="teacherPreparation"
                name="teacherPreparation"
                value={teacherPreparation}
                onChange={(e) => setTeacherPreparation(e.target.value)}
                placeholder="What the teacher should prepare before class"
                rows={3}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valuesAndPcis">Values and pertinent issues</Label>
              <Textarea
                id="valuesAndPcis"
                name="valuesAndPcis"
                value={valuesAndPcis}
                onChange={(e) => setValuesAndPcis(e.target.value)}
                placeholder="Values, life skills and pertinent contemporary issues"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="safetyNotes">Safety notes</Label>
              <Textarea
                id="safetyNotes"
                name="safetyNotes"
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                placeholder="Safety precautions for this lesson"
                rows={3}
              />
            </div>
          </div>
            </CardContent>
          </Card>

      {/* Teaching and learning activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teaching and learning activities</CardTitle>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="differentiation">Support and extension</Label>
              <Textarea
                id="differentiation"
                name="differentiation"
                value={differentiation}
                onChange={(e) => setDifferentiation(e.target.value)}
                placeholder="How will you support or extend learners?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="homework">Homework or extension</Label>
              <Textarea
                id="homework"
                name="homework"
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                placeholder="A short follow-up task for learners"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment and reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment and reflection</CardTitle>
          <p className="text-sm text-muted-foreground">
            Confirm the suggested assessment. Reflection can be completed after teaching the lesson.
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
        </div>
      </details>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
              {state.error}
            </div>
          )}
          <div className="mb-4 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-950">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium">Your lesson plan is ready to preview.</p>
              <p className="text-sm text-emerald-800">The selected curriculum outcomes and lesson sequence will be included in the downloadable plan.</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
                Preview and download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
