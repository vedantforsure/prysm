"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
}

export function IconButton({
  icon,
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center",
        "w-10 h-10 rounded-full shrink-0",
        "text-black dark:text-white",
        "bg-transparent",
        "transition-[background-color,scale] duration-150 ease-ds",
        "active:scale-[0.96]",
        "hfine:hover:bg-ds-neutral-100 dark:hfine:hover:bg-ds-neutral-100/10",
        "active:bg-ds-neutral-400 dark:active:bg-ds-neutral-400/20",
        "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {icon ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="3" x2="8" y2="13" />
          <line x1="3" y1="8" x2="13" y2="8" />
        </svg>
      )}
    </button>
  );
}
