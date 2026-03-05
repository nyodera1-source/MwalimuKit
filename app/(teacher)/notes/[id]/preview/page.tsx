import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Trash2, Copy, StickyNote } from "lucide-react";
import { deleteTeachingNotes, duplicateTeachingNotes } from "../../actions";
import { NotesDownloadCard } from "./download-card";

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture Notes",
  discussion: "Discussion Guide",
  revision: "Revision Notes",
};

const VISIBLE_SECTIONS: { key: string; label: string }[] = [
  { key: "introduction", label: "Introduction / Overview" },
  { key: "keyConcepts", label: "Key Concepts & Definitions" },
];

const BLURRED_SECTIONS: { key: string; label: string }[] = [
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
    <div className="max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notes">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Notes
          </Link>
        </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left side */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-xl">
                  {notes.title || "Untitled Notes"}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{notes.grade.name}</Badge>
                  <Badge variant="secondary">{notes.learningArea.name}</Badge>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                    {NOTE_TYPE_LABELS[notes.noteType] || notes.noteType}
                  </Badge>
                  <Badge
                    variant={
                      notes.status === "published" ? "default" : "secondary"
                    }
                  >
                    {notes.status}
                  </Badge>
                </div>
              </div>
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

          {/* Visible Sections - fully readable */}
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
            <NotesDownloadCard
              notesId={id}
              notesTitle={notes.title || "teaching-notes"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
