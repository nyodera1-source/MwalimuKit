import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, BookOpen } from "lucide-react";
import { NotesExplorer } from "./notes-explorer";
import { MyNotesList } from "./my-notes-list";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const tab = params.tab || "browse";

  // Only fetch user notes when on "my-notes" tab
  let notes: {
    id: string;
    title: string | null;
    noteType: string;
    status: string;
    updatedAt: Date;
    grade: { name: string };
    learningArea: { name: string };
  }[] = [];

  if (tab === "my-notes") {
    notes = await prisma.teachingNotes.findMany({
      where: { userId: session.user.id },
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
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <StickyNote className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold">Teaching Notes</h1>
        </div>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Browse CBC-aligned teaching notes or manage your custom notes.
          Select a topic to preview and download ready-made lecture notes.
        </p>
      </div>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="browse" className="gap-2" asChild>
            <Link href="/notes?tab=browse">
              <BookOpen className="h-4 w-4" />
              Browse Notes
            </Link>
          </TabsTrigger>
          <TabsTrigger value="my-notes" className="gap-2" asChild>
            <Link href="/notes?tab=my-notes">
              <StickyNote className="h-4 w-4" />
              My Notes
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <NotesExplorer />
        </TabsContent>

        <TabsContent value="my-notes">
          <MyNotesList notes={notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
