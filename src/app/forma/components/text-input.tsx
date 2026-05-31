"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextInput({ label, className, id, ...props }: TextInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={inputId} className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-full px-4 py-3",
          "border-[1.5px] border-black/12 dark:border-white/12",
          "text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0",
          "placeholder:text-ds-neutral-500 dark:placeholder:text-ds-neutral-600",
          "bg-white dark:bg-ds-neutral-950",
          "outline-none transition-colors duration-150",
          "focus:border-black/30 dark:focus:border-white/30",
          className,
        )}
        {...props}
      />
    </div>
  );
}
