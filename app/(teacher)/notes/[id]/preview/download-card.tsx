"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, StickyNote } from "lucide-react";

interface NotesDownloadCardProps {
  notesId: string;
  notesTitle: string;
}

export function NotesDownloadCard({ notesId, notesTitle }: NotesDownloadCardProps) {
  const [schoolName, setSchoolName] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams({
        format: "pdf",
        ...(schoolName && { schoolName }),
        ...(classGroup && { classGroup }),
      });

      const response = await fetch(`/api/notes/${notesId}/export?${params.toString()}`);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${notesTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.pdf`;
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
          Download Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="schoolName" className="text-xs">
              School Name <span className="text-muted-foreground">(optional)</span>
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
              Class / Group <span className="text-muted-foreground">(optional)</span>
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
          Includes all sections with formatted content
        </p>
      </CardContent>
    </Card>
  );
}
