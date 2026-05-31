"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function PrimaryButton({
  children = "Proceed",
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        // Layout
        "inline-flex items-center justify-center",
        "px-4 py-2",
        // Shape
        "rounded-full",
        // Border
        "border border-black/8 dark:border-white/8",
        // Typography — Geist Medium 16/20
        "font-sans font-medium text-ds-body text-white dark:text-black whitespace-nowrap",
        // Colors & transitions
        "bg-black dark:bg-white",
        "transition-[background-color,scale,opacity] duration-150 ease-ds",
        "enabled:active:scale-[0.96]",
        // Enabled states
        "enabled:hfine:hover:bg-[#333333] dark:enabled:hfine:hover:bg-ds-neutral-200",
        "enabled:active:bg-[#888888] dark:enabled:active:bg-ds-neutral-400",
        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "enabled:cursor-pointer",
        "select-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
