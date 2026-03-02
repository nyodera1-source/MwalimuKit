"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperForm } from "../paper-form";

interface ImportedPaper {
  subject: string;
  gradeLevel: string;
  year: number | null;
  term: number | null;
  examType: string;
  school: string;
  totalMarks: number | null;
  timeMinutes: number | null;
  paperNumber: number | null;
  questions: {
    questionNumber: string;
    section: string;
    text: string;
    marks: number | null;
    subQuestions: { label: string; text: string; marks: number | null }[];
  }[];
}

export function ImportedPaperLoader() {
  const searchParams = useSearchParams();
  const isImported = searchParams.get("imported") === "1";
  const [defaults, setDefaults] = useState<ImportedPaper | null>(null);
  const [loaded, setLoaded] = useState(!isImported);

  useEffect(() => {
    if (!isImported) return;
    try {
      const raw = sessionStorage.getItem("importedPaper");
      if (raw) {
        const data = JSON.parse(raw) as ImportedPaper;
        setDefaults(data);
        sessionStorage.removeItem("importedPaper");
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, [isImported]);

  if (!loaded) return null;

  if (defaults) {
    return (
      <PaperForm
        defaults={{
          subject: defaults.subject || undefined,
          gradeLevel: defaults.gradeLevel || undefined,
          year: defaults.year || undefined,
          term: defaults.term,
          examType: defaults.examType || undefined,
          school: defaults.school || undefined,
          totalMarks: defaults.totalMarks,
          timeMinutes: defaults.timeMinutes,
          paperNumber: defaults.paperNumber,
          questions: defaults.questions.map((q) => ({
            questionNumber: q.questionNumber,
            section: q.section || "",
            text: q.text,
            marks: q.marks,
            topic: "",
            subTopic: "",
            answer: "",
            subQuestions: q.subQuestions || [],
          })),
        }}
      />
    );
  }

  return <PaperForm />;
}
