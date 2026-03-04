import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Pencil, Trash2, Copy } from "lucide-react";
import { deleteTeachingNotes, duplicateTeachingNotes } from "../../actions";

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture Notes",
  discussion: "Discussion Guide",
  revision: "Revision Notes",
};

const SECTIONS: { key: string; label: string }[] = [
  { key: "introduction", label: "Introduction / Overview" },
  { key: "keyConcepts", label: "Key Concepts & Definitions" },
  { key: "detailedExplanations", label: "Detailed Explanations" },
  { key: "examples", label: "Examples & Illustrations" },
  { key: "studentActivities", label: "Student Activities" },
  { key: "assessmentQuestions", label: "Assessment Questions" },
  { key: "teacherTips", label: "Teacher's Tips / Common Misconceptions" },
];

export default async function PreviewNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const notes = await prisma.teachingNotes.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!notes || notes.userId !== session.user.id) notFound();

  const content = (notes.content as Record<string, string>) || {};

  return (
    <>
      {/* Copy protection styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .preview-protected {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
          `,
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notes">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold">
              {notes.title || "Untitled Notes"}
            </h1>
            <Badge
              variant={notes.status === "published" ? "default" : "secondary"}
            >
              {notes.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/notes/${id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await duplicateTeachingNotes(id);
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            </form>
            <Button size="sm" asChild>
              <a href={`/api/notes/${id}/export?format=pdf`} download>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
            <form
              action={async () => {
                "use server";
                await deleteTeachingNotes(id);
              }}
            >
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
          </div>
        </div>

        {/* Preview Content */}
        <div className="preview-protected space-y-4">
          {/* Header Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Grade</span>
                  <p className="font-medium">{notes.grade.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject</span>
                  <p className="font-medium">{notes.learningArea.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Note Type</span>
                  <p className="font-medium">
                    {NOTE_TYPE_LABELS[notes.noteType] || notes.noteType}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium capitalize">{notes.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Curriculum Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Strand</span>
                  <p className="font-medium">{notes.strand.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sub-Strand</span>
                  <p className="font-medium">{notes.subStrand.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Sections */}
          {SECTIONS.map(({ key, label }) => {
            const value = content[key];
            if (!value) return null;

            // Split into paragraphs and render with proper spacing
            const paragraphs = value.split(/\n\n+/).filter(p => p.trim());

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{label}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  {paragraphs.map((para, idx) => (
                    <p key={idx} className="mb-3 last:mb-0 text-sm leading-relaxed whitespace-pre-wrap">
                      {para.trim()}
                    </p>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
