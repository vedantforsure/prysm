"use client";

import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optional?: boolean;
}

export function Textarea({ label, optional, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={inputId} className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">
        {label}
        {optional && (
          <span className="ml-2 text-[14px] font-normal text-ds-neutral-500 dark:text-ds-neutral-600">Optional</span>
        )}
      </label>
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full rounded-2xl px-4 py-3",
          "border-[1.5px] border-black/12 dark:border-white/12",
          "text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0",
          "placeholder:font-normal placeholder:text-ds-neutral-500 dark:placeholder:text-ds-neutral-600",
          "bg-white dark:bg-ds-neutral-950",
          "outline-none resize-y transition-colors duration-150",
          "focus:border-blue-500 dark:focus:border-blue-400",
          className,
        )}
        {...props}
      />
    </div>
  );
}
