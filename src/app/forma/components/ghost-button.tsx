"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GhostButton({
  children = "Ghost",
  className,
  ...props
}: GhostButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "px-4 py-2",
        "rounded-full",
        "font-sans font-medium text-ds-body whitespace-nowrap",
        "text-ds-neutral-1000 dark:text-ds-neutral-0",
        "bg-transparent border-none",
        "transition-[color,scale] duration-150 ease-ds",
        "active:scale-[0.96]",
        "hfine:hover:text-ds-neutral-700 dark:hfine:hover:text-ds-neutral-400",
        "active:text-ds-neutral-500",
        "cursor-pointer",
        "select-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
