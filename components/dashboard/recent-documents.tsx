import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentDocument {
  id: string;
  title: string | null;
  updatedAt: Date;
  status: string;
  type: "lesson-plan" | "scheme";
}

const typeConfig = {
  "lesson-plan": {
    label: "Lesson Plan",
    icon: FileText,
    href: "/lesson-plans",
    // Both /[id] routes are the *edit* screens. A teacher opening a recent
    // document wants to read it, so link to the preview.
    previewSuffix: "/preview",
    color: "bg-blue-100 text-blue-600",
  },
  scheme: {
    label: "Scheme",
    icon: BookOpen,
    href: "/schemes",
    previewSuffix: "/preview",
    color: "bg-blue-100 text-blue-600",
  },
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
            No documents yet. Create your first scheme of work or lesson plan to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Recent Documents</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Pick up a draft or open a finished document.</p>
        </div>
        <div className="hidden items-center gap-3 text-sm sm:flex">
          <Link href="/schemes" className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
            Schemes <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/lesson-plans" className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800">
            Lesson plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => {
          const config = typeConfig[doc.type];
          const Icon = config.icon;
          return (
            <div
              key={`${doc.type}-${doc.id}`}
              className="flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-colors hover:border-slate-200 hover:bg-slate-50"
            >
              <Link href={`${config.href}/${doc.id}${config.previewSuffix}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
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
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
              </Link>
              <div className="hidden shrink-0 items-center gap-2 text-xs sm:flex">
                <Link href={`${config.href}/${doc.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                  Edit
                </Link>
                <Link href={`${config.href}/${doc.id}${config.previewSuffix}`} className="text-slate-500 hover:text-slate-800">
                  Open
                </Link>
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-center gap-4 pt-2 text-sm font-medium sm:hidden">
          <Link href="/schemes" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            Schemes <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/lesson-plans" className="flex items-center gap-1 text-slate-500 hover:text-slate-800">
            Lesson plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
