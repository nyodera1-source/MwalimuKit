import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const imageSizeMap = {
  sm: 28,
  md: 32,
  lg: 40,
};

export function LogoMark({ size = "md", className }: LogoMarkProps) {
  return (
    <span className={cn("relative inline-flex shrink-0 overflow-hidden rounded-lg shadow-sm", sizeMap[size], className)}>
      <Image
        src="/brand/mwalimukit-chalk-logo.svg"
        alt="MwalimuKit chalkboard logo"
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
        className="h-full w-full object-cover"
        priority={size === "lg"}
      />
    </span>
  );
}
