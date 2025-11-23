import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  className?: string;
  text: string;
  linkUrl: string;
  ArrowClass?: string;
}

export const BackButton = ({
  className,
  text,
  linkUrl,
  ArrowClass,
}: BackButtonProps) => {
  return (
    <nav className={cn("group w-fit bg-[#F4F4F0] p-4", className)}>
      <Link prefetch href={linkUrl || "/"} className="flex items-center gap-3">
        <ArrowLeftIcon
          className={cn(
            "transition-all duration-150 ease-linear group-hover:size-5 group-hover:scale-x-110",
            ArrowClass,
          )}
        />
        <span className="font-medium">{text}</span>
      </Link>
    </nav>
  );
};
