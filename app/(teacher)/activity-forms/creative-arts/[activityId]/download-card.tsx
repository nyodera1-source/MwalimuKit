"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Users, FileUser, Loader2 } from "lucide-react";

interface CreativeArtsDownloadCardProps {
  activityId: string;
  activityName: string;
  gradeName: string;
}

export function CreativeArtsDownloadCard({
  activityId,
  activityName,
  gradeName,
}: CreativeArtsDownloadCardProps) {
  const [schoolName, setSchoolName] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [downloading, setDownloading] = useState<"student" | "teacher" | null>(
    null
  );

  const handleDownload = async (type: "student" | "teacher") => {
    setDownloading(type);
    try {
      const params = new URLSearchParams({
        type,
        ...(schoolName && { schoolName }),
        ...(classGroup && { classGroup }),
        ...(activityDate && { activityDate }),
      });

      const response = await fetch(
        `/api/creative-arts/${activityId}/export?${params.toString()}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activityName
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()}-${type}-copy.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-purple-500" />
          Download Worksheet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="schoolName" className="text-xs">
              School Name{" "}
              <span className="text-muted-foreground">(optional)</span>
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
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="classGroup"
              placeholder={`e.g. ${gradeName} East`}
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="activityDate" className="text-xs">
              Date
            </Label>
            <Input
              id="activityDate"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Button
            onClick={() => handleDownload("student")}
            disabled={downloading !== null}
            className="w-full"
            variant="outline"
          >
            {downloading === "student" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Users className="h-4 w-4 mr-2" />
            )}
            Download Student Worksheet
          </Button>
          <Button
            onClick={() => handleDownload("teacher")}
            disabled={downloading !== null}
            className="w-full"
          >
            {downloading === "teacher" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileUser className="h-4 w-4 mr-2" />
            )}
            Download Teacher Guide
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-1">
          Teacher Guide includes performance criteria & assessment guidance
        </p>
      </CardContent>
    </Card>
  );
}
