"use client";

import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  onRemove?: () => void;
  removing?: boolean;
  className?: string;
}

export function Tag({ label, onRemove, removing = false, className }: TagProps) {
  const El = onRemove ? "button" : "span";
  return (
    <El
      {...(onRemove ? { type: "button" as const, onClick: onRemove, "aria-label": `Remove ${label}` } : {})}
      className={cn(
        "tag-pill inline-flex items-center gap-[5px]",
        "px-[10px] py-[3px] rounded-full",
        "bg-white dark:bg-ds-neutral-950",
        "border border-black/16 dark:border-white/16",
        "text-ds-body font-medium",
        "text-ds-neutral-700 dark:text-ds-neutral-300",
        onRemove && "cursor-pointer transition-colors duration-150 hfine:hover:bg-ds-neutral-100 dark:hfine:hover:bg-ds-neutral-900 active:bg-ds-neutral-400 dark:active:bg-ds-neutral-700",
        removing && "is-removing",
        className,
      )}
    >
      {label}
      {onRemove && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden
          className="shrink-0 text-ds-neutral-500 dark:text-ds-neutral-400"
        >
          <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </El>
  );
}
