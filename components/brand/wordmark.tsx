import Image from "next/image";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-[92px]",
  md: "h-9 w-[128px]",
  lg: "h-14 w-[190px]",
};

export function Wordmark({ size = "md", className }: WordmarkProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", sizeMap[size], className)}>
      <Image
        src="/brand/mwalimukit-wordmark-tagline.png"
        alt="MwalimuKit — Plan Better. Teach Better."
        fill
        sizes="(max-width: 640px) 128px, 190px"
        className="object-contain object-left"
        priority={size === "lg"}
      />
    </span>
  );
}
