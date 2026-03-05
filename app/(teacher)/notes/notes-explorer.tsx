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
  { key: "keyConcepts", label: "Key Concepts & Definitions" },
];

const BLURRED_SECTIONS = [
  { key: "detailedExplanations", label: "Detailed Explanations" },
  { key: "examples", label: "Examples & Illustrations" },
  { key: "studentActivities", label: "Student Activities" },
  { key: "assessmentQuestions", label: "Assessment Questions" },
  { key: "teacherTips", label: "Teacher's Tips / Common Misconceptions" },
];

function ContentSection({ label, value }: { label: string; value: string }) {
  const paragraphs = value.split(/\n\n+/).filter((p) => p.trim());
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
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

  function startPolling(subStrandId: string) {
    stopPolling();
    const startTime = Date.now();
    pollingRef.current = setInterval(async () => {
      // Stop if user changed selection
      if (currentSubStrandRef.current !== subStrandId) {
        stopPolling();
        return;
      }
      // Timeout after 90 seconds
      if (Date.now() - startTime > 90_000) {
        stopPolling();
        setNoteState("error");
        setError("Generation is taking too long. Please try again.");
        return;
      }
      try {
        const res = await fetch(
          `/api/curriculum-notes?subStrandId=${subStrandId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ready") {
            stopPolling();
            setNote(data);
            setNoteState("ready");
          }
        } else if (res.status === 404) {
          // Note was cleaned up (failed/stale) — stop polling, allow retry
          stopPolling();
          setNoteState("error");
          setError("Generation failed. Please try again.");
        }
      } catch {
        // Keep polling on network errors
      }
    }, 3000);
  }

  const fetchOrGenerate = useCallback(
    async (subStrandId: string, selection: CascadeSelection) => {
      currentSubStrandRef.current = subStrandId;
      stopPolling();
      setNoteState("loading");
      setError(null);

      try {
        // Try cached first
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

        // Not cached — generate via existing /api/notes/generate endpoint
        // (which already works on Vercel) then cache the result
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

    // Use the existing /api/notes/generate endpoint with fast mode (Haiku)
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

    // Cache the generated content
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
      // Still show the content even if caching failed
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Select Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CascadeDropdown
            onChange={handleSelectionChange}
            showSLO={false}
          />
        </CardContent>
      </Card>

      {/* Idle State */}
      {noteState === "idle" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <StickyNote className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Select a topic to browse notes
            </h3>
            <p className="text-muted-foreground max-w-md">
              Choose your grade, learning area, strand, and sub-strand above to
              view CBC-aligned teaching notes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {noteState === "loading" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading notes...</p>
          </CardContent>
        </Card>
      )}

      {/* Generating State */}
      {noteState === "generating" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Generating Teaching Notes
              </h3>
              <p className="text-muted-foreground max-w-md">
                Creating comprehensive lecture notes for this topic. This may
                take 15-30 seconds...
              </p>
            </CardContent>
          </Card>
          {/* Skeleton preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <RefreshCw className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
            <p className="text-muted-foreground mb-4">
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
            >
              <RefreshCw className="h-4 w-4 mr-2" />
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
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-xl">
                    {note.title || "Teaching Notes"}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{note.grade.name}</Badge>
                    <Badge variant="secondary">{note.learningArea.name}</Badge>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                      Lecture Notes
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Strand</span>
                    <p className="font-medium">{note.strand.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sub-Strand</span>
                    <p className="font-medium">{note.subStrand.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visible Sections */}
            {VISIBLE_SECTIONS.map(({ key, label }) => {
              const value = content[key];
              if (!value) return null;
              return <ContentSection key={key} label={label} value={value} />;
            })}

            {/* Blurred Sections */}
            <div className="relative">
              <div className="space-y-4 select-none pointer-events-none">
                {BLURRED_SECTIONS.map(({ key, label }) => {
                  const value = content[key];
                  if (!value) return null;
                  const paragraphs = value
                    .split(/\n\n+/)
                    .filter((p) => p.trim());
                  return (
                    <Card key={key}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{label}</CardTitle>
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
                <div className="bg-background/80 backdrop-blur-sm border rounded-xl px-6 py-4 text-center shadow-lg">
                  <StickyNote className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Download to view full teaching notes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detailed explanations, activities, assessment & more
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Card - Right side (sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-purple-500" />
                    Download Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="schoolName" className="text-xs">
                        School Name{" "}
                        <span className="text-muted-foreground">
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
                      <Label htmlFor="classGroup" className="text-xs">
                        Class / Group{" "}
                        <span className="text-muted-foreground">
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

                  <div className="pt-2">
                    <Button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full"
                    >
                      {downloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <StickyNote className="h-4 w-4 mr-2" />
                      )}
                      Download Teaching Notes PDF
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-1">
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
