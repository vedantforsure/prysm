"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface DestructiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function DestructiveButton({
  children = "Delete",
  className,
  ...props
}: DestructiveButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "px-4 py-2",
        "rounded-full",
        "border border-black/16 dark:border-white/16",
        "font-sans font-medium text-ds-body text-white whitespace-nowrap",
        "bg-[#FF0000]",
        "transition-[background-color,scale,opacity] duration-150 ease-ds",
        "enabled:active:scale-[0.96]",
        "enabled:hfine:hover:bg-[#E00000]",
        "enabled:active:bg-[#9D0000]",
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
