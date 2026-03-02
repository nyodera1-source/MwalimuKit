"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, ImagePlus, AlertCircle } from "lucide-react";
import { processUploadedImage } from "@/lib/image/process-uploaded-image";

// ─── Types ───

interface ParsedQuestion {
  questionNumber: string;
  section: string;
  text: string;
  marks: number | null;
  subQuestions: { label: string; text: string; marks: number | null }[];
}

export interface ImportedQuestion {
  id: string;
  text: string;
  marks: number;
  section: string;
  answer: string;
  cognitiveLevel: string;
  needsDiagram: boolean;
  accepted: boolean;
  editing: boolean;
  showAnswer: boolean;
  hasImage: boolean;
  imageUrl?: string;
  source: "imported";
  orderNum: number;
  subQuestions?: { label: string; text: string; marks: number }[];
}

interface QuestionUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionsImported: (questions: ImportedQuestion[]) => void;
  startOrderNum: number;
  /** File passed in from parent — starts upload immediately when dialog opens */
  pendingFile?: File | null;
}

function genId() {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Trigger the native file picker OUTSIDE any Radix portal.
 * Returns a promise that resolves with the selected File or null.
 */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.position = "fixed";
    input.style.top = "-9999px";
    input.style.left = "-9999px";
    input.style.opacity = "0";
    document.body.appendChild(input);

    const cleanup = () => {
      // Small delay to let browser finish processing
      setTimeout(() => {
        if (input.parentNode) input.parentNode.removeChild(input);
      }, 100);
    };

    input.addEventListener("change", () => {
      const f = input.files?.[0] ?? null;
      cleanup();
      resolve(f);
    });

    // Handle cancel (user closes file picker without selecting)
    input.addEventListener("cancel", () => {
      cleanup();
      resolve(null);
    });

    // Use setTimeout to break out of any Radix event handling chain
    setTimeout(() => input.click(), 0);
  });
}

// ─── Component ───

export function QuestionUploadDialog({
  open,
  onOpenChange,
  onQuestionsImported,
  startOrderNum,
  pendingFile,
}: QuestionUploadDialogProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "parsed" | "error">("idle");
  const [error, setError] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [imageFiles, setImageFiles] = useState<Map<string, string>>(new Map());
  const pendingFileRef = useRef<File | null>(null);

  // When a pending file is provided and dialog opens, start upload immediately
  useEffect(() => {
    if (open && pendingFile && pendingFile !== pendingFileRef.current && status === "idle") {
      pendingFileRef.current = pendingFile;
      handleFileUpload(pendingFile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingFile]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
    setParsedQuestions([]);
    setSelectedIds(new Set());
    setImageFiles(new Map());
  }, []);

  async function handleFileUpload(file: File) {
    setStatus("uploading");
    setError("");

    const fd = new FormData();
    fd.append("file", file);

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const isWord = file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isWord) {
      setError("Please upload a PDF (.pdf) or Word (.docx) file.");
      setStatus("error");
      return;
    }

    const endpoint = isPdf
      ? "/api/question-bank/import"
      : "/api/exams/import-word";

    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to parse file.");
        setStatus("error");
        return;
      }

      if (data.warning) {
        setError(data.warning);
        setStatus("error");
        return;
      }

      const questions: ParsedQuestion[] = data.paper?.questions || [];
      if (questions.length === 0) {
        setError(
          "No questions could be extracted from this file. " +
          "The file may be scanned/image-based, or uses a format the parser doesn't recognize. " +
          "Try a text-based PDF or type questions manually instead."
        );
        setStatus("error");
        return;
      }

      setParsedQuestions(questions);
      setSelectedIds(new Set(questions.map((q) => q.questionNumber)));
      setStatus("parsed");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
      setStatus("error");
    }
  }

  async function handleImageUpload(questionNumber: string, file: File) {
    try {
      const base64 = await processUploadedImage(file);
      setImageFiles(new Map(imageFiles.set(questionNumber, base64)));
    } catch {
      // Silently fail — user can try again
    }
  }

  function handleImport() {
    const selected = parsedQuestions.filter((q) =>
      selectedIds.has(q.questionNumber)
    );

    const imported: ImportedQuestion[] = selected.map((q, i) => {
      const imageUrl = imageFiles.get(q.questionNumber);
      return {
        id: genId(),
        text: q.text,
        marks: q.marks || 2,
        section: q.section || "A",
        answer: "",
        cognitiveLevel: "apply",
        needsDiagram: false,
        accepted: true,
        editing: false,
        showAnswer: false,
        hasImage: !!imageUrl,
        imageUrl,
        source: "imported" as const,
        orderNum: startOrderNum + i,
        subQuestions: q.subQuestions?.length
          ? q.subQuestions.map((sq) => ({
              label: sq.label,
              text: sq.text,
              marks: sq.marks || 1,
            }))
          : undefined,
      };
    });

    onQuestionsImported(imported);
    reset();
    onOpenChange(false);
  }

  function toggleQuestion(qNum: string) {
    const next = new Set(selectedIds);
    next.has(qNum) ? next.delete(qNum) : next.add(qNum);
    setSelectedIds(next);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && status === "uploading") return;
        if (!val) reset();
        onOpenChange(val);
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (status === "uploading" || status === "parsed") {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Exam Questions</DialogTitle>
        </DialogHeader>

        {/* Idle — file upload area */}
        {status === "idle" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="font-medium">Upload a PDF or Word file</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Supports .pdf and .docx files
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  // Close dialog first, then open file picker outside Radix
                  onOpenChange(false);
                  const file = await pickFile(".pdf,.docx");
                  if (file) {
                    // Re-open dialog to show progress
                    onOpenChange(true);
                    handleFileUpload(file);
                  }
                }}
              >
                Choose File
              </Button>
            </div>
          </div>
        )}

        {/* Uploading */}
        {status === "uploading" && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Extracting questions...
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reset} className="flex-1">
                Try Again
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  reset();
                  onOpenChange(false);
                  const file = await pickFile(".pdf,.docx");
                  if (file) {
                    onOpenChange(true);
                    handleFileUpload(file);
                  }
                }}
              >
                Upload Different File
              </Button>
            </div>
          </div>
        )}

        {/* Parsed — question selection */}
        {status === "parsed" && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">
                Found {parsedQuestions.length} question
                {parsedQuestions.length !== 1 ? "s" : ""}. Select which to
                import:
              </p>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {parsedQuestions.map((q) => (
                <div
                  key={q.questionNumber}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.has(q.questionNumber)}
                      onCheckedChange={() => toggleQuestion(q.questionNumber)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          Q{q.questionNumber}
                        </span>
                        {q.section && (
                          <span className="text-xs text-muted-foreground">
                            Section {q.section}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {q.text}
                      </p>
                      {q.subQuestions.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ({q.subQuestions.length} sub-question
                          {q.subQuestions.length !== 1 ? "s" : ""})
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {q.marks ?? "?"}mk
                    </span>
                  </div>

                  {/* Image upload for selected questions */}
                  {selectedIds.has(q.questionNumber) && (
                    <div className="pl-7">
                      {imageFiles.has(q.questionNumber) ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={imageFiles.get(q.questionNumber)}
                            alt="Diagram"
                            className="h-16 w-auto rounded border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const next = new Map(imageFiles);
                              next.delete(q.questionNumber);
                              setImageFiles(next);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-primary"
                          onClick={async () => {
                            const file = await pickFile("image/*");
                            if (file) handleImageUpload(q.questionNumber, file);
                          }}
                        >
                          <ImagePlus className="h-3.5 w-3.5 mr-1.5" />
                          Add diagram/image
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  reset();
                  onOpenChange(false);
                  const file = await pickFile(".pdf,.docx");
                  if (file) {
                    onOpenChange(true);
                    handleFileUpload(file);
                  }
                }}
              >
                Upload Different File
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                disabled={selectedIds.size === 0}
                className="flex-1"
              >
                Import {selectedIds.size} Question
                {selectedIds.size !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
