import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture",
  discussion: "Discussion",
  revision: "Revision",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const tab = params.tab || "all";

  const where: Record<string, unknown> = { userId: session.user.id };
  if (tab === "drafts") where.status = "draft";
  if (tab === "published") where.status = "published";

  const notes = await prisma.teachingNotes.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      noteType: true,
      status: true,
      updatedAt: true,
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teaching Notes</h1>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Notes
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/notes?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="drafts" asChild>
            <Link href="/notes?tab=drafts">Drafts</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/notes?tab=published">Published</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">
                No teaching notes yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create detailed teaching notes with AI-powered content
                generation aligned to the CBC curriculum.
              </p>
              <Button asChild>
                <Link href="/notes/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notes
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/notes/${note.id}/preview`}
                          className="hover:underline"
                        >
                          {note.title || "Untitled Notes"}
                        </Link>
                      </TableCell>
                      <TableCell>{note.grade.name}</TableCell>
                      <TableCell>{note.learningArea.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {NOTE_TYPE_LABELS[note.noteType] || note.noteType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            note.status === "published" ? "default" : "secondary"
                          }
                        >
                          {note.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/notes/${note.id}/preview`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
