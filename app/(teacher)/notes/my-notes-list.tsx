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
import { Plus, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture",
  discussion: "Discussion",
  revision: "Revision",
};

interface NoteItem {
  id: string;
  title: string | null;
  noteType: string;
  status: string;
  updatedAt: Date;
  grade: { name: string };
  learningArea: { name: string };
}

interface MyNotesListProps {
  notes: NoteItem[];
}

export function MyNotesList({ notes }: MyNotesListProps) {
  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Notes
          </Link>
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No custom notes yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your own teaching notes with AI-powered content generation
            aligned to the CBC curriculum.
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
    </div>
  );
}
