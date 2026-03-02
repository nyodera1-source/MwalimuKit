import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FileText, BookOpen, ClipboardList, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentDocument {
  id: string;
  title: string | null;
  updatedAt: Date;
  status: string;
  type: "lesson-plan" | "scheme" | "exam" | "notes";
}

const typeConfig = {
  "lesson-plan": { label: "Lesson Plan", icon: FileText, href: "/lesson-plans", color: "bg-blue-100 text-blue-600" },
  scheme: { label: "Scheme", icon: BookOpen, href: "/schemes", color: "bg-emerald-100 text-emerald-600" },
  exam: { label: "Exam", icon: ClipboardList, href: "/exams", color: "bg-amber-100 text-amber-600" },
  notes: { label: "Notes", icon: StickyNote, href: "/notes", color: "bg-purple-100 text-purple-600" },
};

const statusColors: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700 border-amber-200",
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  final: "bg-blue-100 text-blue-700 border-blue-200",
};

interface RecentDocumentsProps {
  documents: RecentDocument[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No documents yet. Create your first lesson plan, scheme, exam, or teaching notes to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => {
          const config = typeConfig[doc.type];
          const Icon = config.icon;
          return (
            <Link
              key={`${doc.type}-${doc.id}`}
              href={`${config.href}/${doc.id}`}
              className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {doc.title || `Untitled ${config.label}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(doc.updatedAt, { addSuffix: true })}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("shrink-0 text-[11px]", statusColors[doc.status] || "")}
              >
                {doc.status}
              </Badge>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
