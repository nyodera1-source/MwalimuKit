import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react";
import { deleteSchemeOfWork } from "../../actions";
import type { SchemeConfig } from "@/lib/export/scheme-of-work-types";

export default async function PreviewSchemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const scheme = await prisma.schemeOfWork.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true } },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!scheme || scheme.userId !== session.user.id) notFound();

  const data = (scheme.weeks as unknown as SchemeConfig) || {};
  const entries = data.entries || [];
  const breaks = data.breaks || [];

  // Build display items: lessons + combined breaks sorted by week
  type DisplayItem =
    | { kind: "lesson"; entry: (typeof entries)[0] }
    | { kind: "break"; title: string; weekLabel: string; startWeek: number };
  const displayItems: DisplayItem[] = [];

  for (const entry of entries) {
    displayItems.push({ kind: "lesson", entry });
  }
  for (const b of breaks) {
    const weekLabel = b.duration > 1
      ? `${b.weekNumber}-${b.weekNumber + b.duration - 1}`
      : String(b.weekNumber);
    displayItems.push({ kind: "break", title: b.title || "Break", weekLabel, startWeek: b.weekNumber });
  }
  displayItems.sort((a, b) => {
    const wA = a.kind === "lesson" ? a.entry.week : a.startWeek;
    const wB = b.kind === "lesson" ? b.entry.week : b.startWeek;
    if (wA !== wB) return wA - wB;
    return a.kind === "break" ? -1 : 1;
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `.preview-protected { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('contextmenu', function(e) { if (e.target.closest('.preview-protected')) e.preventDefault(); });
            document.addEventListener('copy', function(e) { if (e.target.closest && e.target.closest('.preview-protected')) e.preventDefault(); });
            document.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'p')) {
                var el = document.querySelector('.preview-protected');
                if (el && el.contains(document.activeElement || e.target)) e.preventDefault();
              }
            });
          `,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/schemes">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{scheme.title || "Untitled Scheme"}</h1>
            <Badge variant={scheme.status === "published" ? "default" : "secondary"}>
              {scheme.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/schemes/${id}`}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Link>
            </Button>
            <Button size="sm" asChild>
              <a href={`/api/schemes/${id}/export`} download>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </a>
            </Button>
            <form action={async () => { "use server"; await deleteSchemeOfWork(id); }}>
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </form>
          </div>
        </div>

        <div className="preview-protected space-y-4">
          {/* Header Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">School</span>
                  <p className="font-medium">{data.schoolName || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Teacher</span>
                  <p className="font-medium">{scheme.user.fullName || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Grade</span>
                  <p className="font-medium">{scheme.grade.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject</span>
                  <p className="font-medium">{scheme.learningArea.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Term & Year</span>
                  <p className="font-medium">Term {scheme.term}, {scheme.year}</p>
                </div>
              </div>
              {data.referenceBook && (
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Reference Book: </span>
                  <span className="font-medium">{data.referenceBook}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lesson Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Plan</CardTitle>
              <p className="text-sm text-muted-foreground">
                {entries.length} lessons — {data.lessonsPerWeek || 5} per week
                {breaks.length > 0 && ` — ${breaks.length} break(s)`}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="border p-2 text-left w-10">WK</th>
                      <th className="border p-2 text-left w-10">LSN</th>
                      <th className="border p-2 text-left">STRAND</th>
                      <th className="border p-2 text-left">SUB-STRAND</th>
                      <th className="border p-2 text-left">OBJECTIVES</th>
                      <th className="border p-2 text-left">T/L ACTIVITIES</th>
                      <th className="border p-2 text-left">T/L AIDS</th>
                      <th className="border p-2 text-left">REFERENCE</th>
                      <th className="border p-2 text-left">REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item, idx) => {
                      if (item.kind === "break") {
                        return (
                          <tr key={`break-${idx}`} className="bg-amber-50">
                            <td className="border p-2 font-bold text-center">{item.weekLabel}</td>
                            <td colSpan={8} className="border p-2 text-center italic font-medium text-amber-700">
                              {item.title}
                            </td>
                          </tr>
                        );
                      }
                      const entry = item.entry;
                      return (
                        <tr key={`lesson-${idx}`} className="hover:bg-muted/30">
                          <td className="border p-2 font-bold text-center">{entry.week}</td>
                          <td className="border p-2 text-center">{entry.lesson}</td>
                          <td className="border p-2">{entry.topic || "—"}</td>
                          <td className="border p-2">{entry.subTopic || "—"}</td>
                          <td className="border p-2 whitespace-pre-wrap">{entry.objectives || "—"}</td>
                          <td className="border p-2 whitespace-pre-wrap">{entry.tlActivities || "—"}</td>
                          <td className="border p-2 whitespace-pre-wrap">{entry.tlAids || "—"}</td>
                          <td className="border p-2 whitespace-pre-wrap">{entry.reference || "—"}</td>
                          <td className="border p-2 whitespace-pre-wrap">{entry.remarks || ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
