import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const colorMap = {
  blue: {
    border: "border-t-blue-500",
    iconBg: "bg-blue-100 text-blue-600",
    btn: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  emerald: {
    border: "border-t-emerald-500",
    iconBg: "bg-emerald-100 text-emerald-600",
    btn: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  amber: {
    border: "border-t-amber-500",
    iconBg: "bg-amber-100 text-amber-600",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  purple: {
    border: "border-t-purple-500",
    iconBg: "bg-purple-100 text-purple-600",
    btn: "bg-purple-500 hover:bg-purple-600 text-white",
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
    <Card className={cn("hover:shadow-md transition-shadow border-t-4", c.border)}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
          <Link href={href} className="font-semibold hover:underline">
            {title}
          </Link>
        </div>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {lastEdited
            ? `Last edited ${formatDistanceToNow(lastEdited, { addSuffix: true })}`
            : "No documents yet"}
        </p>
        <Button asChild size="sm" className={cn("w-full rounded-lg", c.btn)}>
          <Link href={createHref}>
            <Plus className="h-4 w-4 mr-1" /> Create New
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
