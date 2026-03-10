"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";

interface CreativeArtsFormDownloadCardProps {
  formId: string;
  formName: string;
  formType: string;
  gradeName: string;
}

const formTypeConfig: Record<
  string,
  { title: string; fields: string[]; description: string }
> = {
  adjudication: {
    title: "Download Adjudication Form",
    fields: ["schoolName", "eventName", "date"],
    description: "Printable scoring sheet with criteria and comment areas",
  },
  rehearsal_plan: {
    title: "Download Rehearsal Plan",
    fields: ["schoolName", "teacherName", "date"],
    description: "Structured plan with warm-ups, repertoire, and focus areas",
  },
  performance_program: {
    title: "Download Program",
    fields: ["schoolName", "eventName", "date"],
    description: "Formal event program with running order and details",
  },
  portfolio_assessment: {
    title: "Download Assessment Sheet",
    fields: ["schoolName", "teacherName", "studentName", "date"],
    description: "Assessment rubric with criteria, checklist, and comments",
  },
};

export function CreativeArtsFormDownloadCard({
  formId,
  formName,
  formType,
  gradeName,
}: CreativeArtsFormDownloadCardProps) {
  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [downloading, setDownloading] = useState(false);

  const config = formTypeConfig[formType] || formTypeConfig.adjudication;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams({
        ...(schoolName && { schoolName }),
        ...(teacherName && { teacherName }),
        ...(studentName && { studentName }),
        ...(eventName && { eventName }),
        ...(date && { date }),
      });

      const response = await fetch(
        `/api/creative-arts-forms/${formId}/export?${params.toString()}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formName
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-purple-500" />
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {config.fields.includes("schoolName") && (
            <div>
              <Label htmlFor="schoolName" className="text-xs">
                School Name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="schoolName"
                placeholder="e.g. Alliance High School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {config.fields.includes("teacherName") && (
            <div>
              <Label htmlFor="teacherName" className="text-xs">
                Teacher Name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="teacherName"
                placeholder="e.g. Mr. Kamau"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {config.fields.includes("studentName") && (
            <div>
              <Label htmlFor="studentName" className="text-xs">
                Student Name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="studentName"
                placeholder={`e.g. ${gradeName} student`}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {config.fields.includes("eventName") && (
            <div>
              <Label htmlFor="eventName" className="text-xs">
                Event Name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="eventName"
                placeholder="e.g. Kenya Music Festival"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {config.fields.includes("date") && (
            <div>
              <Label htmlFor="date" className="text-xs">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download PDF
        </Button>

        <p className="text-xs text-muted-foreground text-center pt-1">
          {config.description}
        </p>
      </CardContent>
    </Card>
  );
}
