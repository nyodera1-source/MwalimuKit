"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  CascadeDropdown,
  CascadeSelection,
} from "@/components/cbe/cascade-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StickyNote,
  Download,
  Loader2,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface CurriculumNoteData {
  id: string;
  title: string;
  content: Record<string, string>;
  status: string;
  grade: { name: string };
  learningArea: { name: string };
  strand: { name: string };
  subStrand: { name: string };
}

type NoteState = "idle" | "loading" | "generating" | "ready" | "error";

const VISIBLE_SECTIONS = [
  { key: "introduction", label: "Introduction / Overview" },
];

const BLURRED_SECTIONS = [
  { key: "keyConcepts", label: "Key Concepts & Definitions" },
  { key: "detailedExplanations", label: "Detailed Explanations" },
  { key: "examples", label: "Examples & Illustrations" },
  { key: "studentActivities", label: "Student Activities" },
  { key: "assessmentQuestions", label: "Assessment Questions" },
  { key: "teacherTips", label: "Teacher's Tips / Common Misconceptions" },
];

const SECTION_ICONS: Record<string, typeof BookOpen> = {
  introduction: BookOpen,
  keyConcepts: Layers,
  detailedExplanations: FileText,
  examples: Sparkles,
  studentActivities: GraduationCap,
  assessmentQuestions: CheckCircle2,
  teacherTips: StickyNote,
};

function cleanDisplayText(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/gi, "")
    .replace(/```\s*$/g, "")
    .replace(/[{}"\\]/g, (ch) => {
      // Strip JSON structural characters that shouldn't appear in prose
      if (ch === "{" || ch === "}" || ch === "\\") return "";
      // Keep quotes only if they look like natural speech quotes
      return ch;
    })
    .replace(/^\s*"?\w+"?\s*:\s*/gm, "") // Remove "key": patterns
    .trim();
}

function ContentSection({ label, value, sectionKey }: { label: string; value: string; sectionKey: string }) {
  const cleaned = cleanDisplayText(value);
  const paragraphs = cleaned.split(/\n\n+/).filter((p) => p.trim());
  const Icon = SECTION_ICONS[sectionKey] || FileText;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-4 w-4 text-purple-500" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        {paragraphs.map((para, idx) => (
          <p
            key={idx}
            className="mb-3 last:mb-0 text-sm leading-relaxed whitespace-pre-wrap"
          >
            {para.trim()}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function NotesExplorer() {
  const [noteState, setNoteState] = useState<NoteState>("idle");
  const [note, setNote] = useState<CurriculumNoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentSubStrandRef = useRef<string | null>(null);
  const lastSelectionRef = useRef<CascadeSelection | null>(null);

  // Download card state
  const [schoolName, setSchoolName] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  const fetchOrGenerate = useCallback(
    async (subStrandId: string, selection: CascadeSelection) => {
      currentSubStrandRef.current = subStrandId;
      stopPolling();
      setNoteState("loading");
      setError(null);

      try {
        const res = await fetch(
          `/api/curriculum-notes?subStrandId=${subStrandId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ready") {
            setNote(data);
            setNoteState("ready");
            return;
          }
        }

        await generateClientSide(subStrandId, selection);
      } catch {
        setNoteState("error");
        setError(
          "Network error. Please check your connection and try again."
        );
      }
    },
    []
  );

  async function generateClientSide(
    subStrandId: string,
    selection: CascadeSelection
  ) {
    if (currentSubStrandRef.current !== subStrandId) return;

    setNoteState("generating");

    const aiRes = await fetch("/api/notes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gradeId: selection.gradeId,
        learningAreaId: selection.learningAreaId,
        strandId: selection.strandId,
        subStrandId,
        noteType: "lecture",
        fast: true,
      }),
    });

    if (!aiRes.ok) {
      const errData = await aiRes.json().catch(() => ({}));
      setNoteState("error");
      setError(
        (errData as { error?: string }).error ||
          "Failed to generate notes. Please try again."
      );
      return;
    }

    const { notes: content } = await aiRes.json();

    if (currentSubStrandRef.current !== subStrandId) return;

    const cacheRes = await fetch("/api/curriculum-notes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subStrandId, content }),
    });

    if (cacheRes.ok) {
      const data = await cacheRes.json();
      setNote(data);
      setNoteState("ready");
    } else {
      setNote({
        id: "temp",
        title: "",
        content,
        status: "ready",
        grade: { name: "" },
        learningArea: { name: "" },
        strand: { name: "" },
        subStrand: { name: "" },
      });
      setNoteState("ready");
    }
  }

  const handleSelectionChange = useCallback(
    (selection: CascadeSelection) => {
      if (!selection.subStrandId) {
        stopPolling();
        setNoteState("idle");
        setNote(null);
        currentSubStrandRef.current = null;
        return;
      }

      lastSelectionRef.current = selection;
      fetchOrGenerate(selection.subStrandId, selection);
    },
    [fetchOrGenerate]
  );

  const handleDownload = async () => {
    if (!note) return;
    setDownloading(true);
    try {
      const params = new URLSearchParams({
        ...(schoolName && { schoolName }),
        ...(classGroup && { classGroup }),
      });

      const response = await fetch(
        `/api/curriculum-notes/${note.id}/export?${params.toString()}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(note.title || "teaching-notes")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const content = (note?.content as Record<string, string>) || {};

  return (
    <div className="space-y-6">
      {/* Curriculum Selector */}
      <Card className="border-purple-200 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 via-background to-background dark:from-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
              <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Select Topic
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your curriculum path to view or generate teaching notes
          </p>
        </CardHeader>
        <CardContent>
          <CascadeDropdown
            onChange={handleSelectionChange}
            showSLO={false}
          />
        </CardContent>
      </Card>

      {/* Idle State — Visual guide */}
      {noteState === "idle" && (
        <div className="space-y-6">
          {/* How it works steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                icon: GraduationCap,
                title: "Select Topic",
                desc: "Choose your grade, subject, strand, and sub-strand from the dropdowns above",
                color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                step: "2",
                icon: Sparkles,
                title: "Preview Notes",
                desc: "AI-generated lecture notes appear instantly with a brief preview of key content",
                color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                step: "3",
                icon: Download,
                title: "Download PDF",
                desc: "Add your school details and download the complete notes as a formatted PDF",
                color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="relative overflow-hidden group hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${item.color} shrink-0`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
                {item.step !== "3" && (
                  <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* What's included card */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 shrink-0">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Each set of notes includes 7 comprehensive sections
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {[
                      "Introduction / Overview",
                      "Key Concepts & Definitions",
                      "Detailed Explanations",
                      "Examples & Illustrations",
                      "Student Activities",
                      "Assessment Questions",
                      "Teacher's Tips",
                    ].map((section, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        {section}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {noteState === "loading" && (
        <Card className="border-purple-200 dark:border-purple-900/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-200/50 dark:bg-purple-800/20 animate-ping" />
              <div className="relative p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
            </div>
            <p className="text-muted-foreground mt-6 font-medium">
              Checking for cached notes...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Generating State */}
      {noteState === "generating" && (
        <div className="space-y-4">
          <Card className="border-purple-200 dark:border-purple-900/40 overflow-hidden">
            {/* Progress bar animation */}
            <div className="h-1 bg-purple-100 dark:bg-purple-900/30">
              <div className="h-full bg-purple-500 animate-[progress_2s_ease-in-out_infinite] rounded-r-full"
                   style={{ width: '60%', animation: 'progress 2s ease-in-out infinite' }} />
            </div>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-4">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Generating Teaching Notes
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                AI is creating comprehensive lecture notes aligned to CBC.
                This usually takes 10-20 seconds...
              </p>
              <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  Curriculum aligned
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  7 sections
                </div>
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Writing...
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Skeleton preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-50">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="border-2 border-purple-200 dark:border-purple-900/50">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {noteState === "error" && (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-destructive/10 mb-4">
              <RefreshCw className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {error || "Something went wrong. Please try again."}
            </p>
            <Button
              onClick={() => {
                if (currentSubStrandRef.current && lastSelectionRef.current) {
                  fetchOrGenerate(
                    currentSubStrandRef.current,
                    lastSelectionRef.current
                  );
                }
              }}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ready State — Preview + Download */}
      {noteState === "ready" && note && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header Card */}
            <Card className="border-purple-200 dark:border-purple-900/40 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />
              <CardHeader>
                <div className="space-y-3">
                  <CardTitle className="text-xl">
                    {note.title || "Teaching Notes"}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {note.grade.name}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      {note.learningArea.name}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0 gap-1">
                      <FileText className="h-3 w-3" />
                      Lecture Notes
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/50">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Strand
                    </span>
                    <p className="font-medium mt-0.5">{note.strand.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Sub-Strand
                    </span>
                    <p className="font-medium mt-0.5">{note.subStrand.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visible Sections */}
            {VISIBLE_SECTIONS.map(({ key, label }) => {
              const value = content[key];
              if (!value) return null;
              return <ContentSection key={key} sectionKey={key} label={label} value={value} />;
            })}

            {/* Blurred Sections */}
            <div className="relative">
              <div className="space-y-4 select-none pointer-events-none">
                {BLURRED_SECTIONS.map(({ key, label }) => {
                  const value = content[key];
                  if (!value) return null;
                  const Icon = SECTION_ICONS[key] || FileText;
                  const paragraphs = value
                    .split(/\n\n+/)
                    .filter((p) => p.trim());
                  return (
                    <Card key={key}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Icon className="h-4 w-4 text-purple-500" />
                          {label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="blur-[6px]">
                        {paragraphs.slice(0, 3).map((para, idx) => (
                          <p
                            key={idx}
                            className="mb-3 last:mb-0 text-sm leading-relaxed"
                          >
                            {para.trim()}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 pointer-events-none rounded-lg" />

              {/* Unlock message overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 rounded-xl px-8 py-5 text-center shadow-xl">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-3">
                    <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="font-semibold text-sm">
                    Download to view full teaching notes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    6 more sections: key concepts, explanations, examples & more
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Card - Right side (sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                      <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Download Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="schoolName" className="text-xs font-medium">
                        School Name{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="schoolName"
                        placeholder="e.g. Moi High School"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="classGroup" className="text-xs font-medium">
                        Class / Group{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="classGroup"
                        placeholder="e.g. Grade 7 East"
                        value={classGroup}
                        onChange={(e) => setClassGroup(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    {downloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download Teaching Notes PDF
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Includes all 7 sections with formatted content
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
