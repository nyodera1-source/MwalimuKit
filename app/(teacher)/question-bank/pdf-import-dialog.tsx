"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ParsedQuestion {
  questionNumber: string;
  section: string;
  text: string;
  marks: number | null;
  subQuestions: { label: string; text: string; marks: number | null }[];
}

interface ParsedPaper {
  subject: string;
  gradeLevel: string;
  year: number | null;
  term: number | null;
  examType: string;
  school: string;
  totalMarks: number | null;
  timeMinutes: number | null;
  paperNumber: number | null;
  questions: ParsedQuestion[];
}

export function PdfImportDialog() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ paper: ParsedPaper; totalPages: number; warning?: string } | null>(null);
  const [fileName, setFileName] = useState("");

  const reset = () => {
    setStatus("idle");
    setError("");
    setResult(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async (file: File) => {
    setFileName(file.name);
    setStatus("uploading");
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/question-bank/import", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Failed to parse PDF.");
        return;
      }

      setResult({ paper: data.paper, totalPages: data.totalPages, warning: data.warning });
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      setError("Please drop a PDF file.");
    }
  };

  const proceedToForm = () => {
    if (!result) return;
    // Encode parsed data in sessionStorage and navigate to new paper form
    sessionStorage.setItem("importedPaper", JSON.stringify(result.paper));
    setOpen(false);
    router.push("/question-bank/new?imported=1");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" /> Import PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Exam Paper from PDF</DialogTitle>
          <DialogDescription>
            Upload a PDF exam paper and we&apos;ll extract the questions automatically.
          </DialogDescription>
        </DialogHeader>

        {status === "idle" && (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-sm">Drop a PDF here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports text-based PDFs (not scanned images)
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === "uploading" && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-sm font-medium">Parsing {fileName}...</p>
            <p className="text-xs text-muted-foreground mt-1">Extracting questions from the PDF</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Import Failed</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={reset}>
              Try Another File
            </Button>
          </div>
        )}

        {status === "done" && result && (
          <div className="space-y-4">
            {result.warning ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No questions extracted</p>
                  <p className="text-xs text-amber-600 mt-1">{result.warning}</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Extracted {result.paper.questions.length} question{result.paper.questions.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    from {result.totalPages} page{result.totalPages !== 1 ? "s" : ""} — {fileName}
                  </p>
                </div>
              </div>
            )}

            {/* Detected metadata */}
            <div className="border rounded-lg p-3 space-y-1.5 text-sm">
              <p className="font-medium text-xs text-muted-foreground uppercase">Detected Info</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {result.paper.subject && <p><span className="text-muted-foreground">Subject:</span> {result.paper.subject}</p>}
                {result.paper.gradeLevel && <p><span className="text-muted-foreground">Level:</span> {result.paper.gradeLevel}</p>}
                {result.paper.year && <p><span className="text-muted-foreground">Year:</span> {result.paper.year}</p>}
                {result.paper.examType && <p><span className="text-muted-foreground">Type:</span> {result.paper.examType}</p>}
                {result.paper.school && <p><span className="text-muted-foreground">School:</span> {result.paper.school}</p>}
                {result.paper.totalMarks && <p><span className="text-muted-foreground">Total Marks:</span> {result.paper.totalMarks}</p>}
                {result.paper.timeMinutes && <p><span className="text-muted-foreground">Duration:</span> {result.paper.timeMinutes} min</p>}
                {result.paper.paperNumber && <p><span className="text-muted-foreground">Paper #:</span> {result.paper.paperNumber}</p>}
              </div>
            </div>

            {/* Question preview */}
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              <p className="font-medium text-xs text-muted-foreground uppercase">Questions Preview</p>
              {result.paper.questions.slice(0, 10).map((q, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium">Q{q.questionNumber}</span>
                  {q.section && <span className="text-muted-foreground"> (Sec {q.section})</span>}
                  {q.marks && <span className="text-muted-foreground"> [{q.marks}mks]</span>}
                  {" — "}
                  <span className="text-muted-foreground">
                    {q.text.substring(0, 100)}{q.text.length > 100 ? "..." : ""}
                  </span>
                  {q.subQuestions.length > 0 && (
                    <span className="text-muted-foreground ml-1">
                      (+{q.subQuestions.length} sub-Q{q.subQuestions.length > 1 ? "s" : ""})
                    </span>
                  )}
                </div>
              ))}
              {result.paper.questions.length > 10 && (
                <p className="text-xs text-muted-foreground">
                  ... and {result.paper.questions.length - 10} more
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={reset}>
                Try Another
              </Button>
              <Button className="flex-1" onClick={proceedToForm}>
                Continue to Edit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
