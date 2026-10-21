import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, type LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// One blue system for the whole product. The emerald/amber/purple variants
// were removed with the paused modules — do not reintroduce them per tile.
const colorMap = {
  blue: {
    border: "border-t-blue-500",
    iconBg: "bg-blue-100 text-blue-600",
    btn: "bg-blue-500 hover:bg-blue-600 text-white",
  },
};

interface ModuleTileProps {
  title: string;
  icon: LucideIcon;
  count: number;
  lastEdited: Date | null;
  href: string;
  createHref: string;
  color: keyof typeof colorMap;
}

export function ModuleTile({
  title,
  icon: Icon,
  count,
  lastEdited,
  href,
  createHref,
  color,
}: ModuleTileProps) {
  const c = colorMap[color];

  return (
    <Card className={cn("transition-shadow hover:shadow-md", c.border)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Link href={href} className="font-semibold text-slate-950 hover:text-blue-700">
              {title}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {count === 0 ? "Nothing created yet" : `${count} document${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <Link href={href} aria-label={`View ${title}`} className="text-slate-400 hover:text-blue-600">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="text-2xl font-bold text-slate-950">{count}</div>
          <p className="text-right text-xs text-muted-foreground">
            {lastEdited
              ? `Last edited ${formatDistanceToNow(lastEdited, { addSuffix: true })}`
              : "No documents yet"}
          </p>
        </div>
        <Button asChild size="sm" className={cn("mt-4 w-full rounded-lg", c.btn)}>
          <Link href={createHref}>
            <Plus className="mr-1 h-4 w-4" /> Create {title === "Schemes of Work" ? "Scheme" : "Lesson Plan"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
