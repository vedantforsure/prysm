"use client";

import { useState, useId } from "react";

interface CheckboxProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ label, description, defaultChecked = false, onChange }: CheckboxProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const id = useId();

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input id={id} type="checkbox" checked={checked} onChange={toggle} className="sr-only" />
      <div
        aria-hidden
        data-checked={checked}
        className={[
          "w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 mt-[3px]",
          "transition-[background-color,border-color] duration-150 ease-ds",
          checked
            ? "bg-ds-neutral-1000 dark:bg-ds-neutral-0 border-ds-neutral-1000 dark:border-ds-neutral-0"
            : "bg-white dark:bg-ds-neutral-950 border-black/20 dark:border-white/20 hfine:group-hover:border-black/40 dark:hfine:group-hover:border-white/40",
        ].join(" ")}
      >
        <svg
          width="10" height="8" viewBox="0 0 10 8" fill="none"
          style={{
            opacity:    checked ? 1 : 0,
            transform:  checked ? "scale(1)" : "scale(0.25)",
            filter:     checked ? "blur(0px)" : "blur(4px)",
            transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), filter 150ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <path
            d="M1.5 4L3.5 6L8.5 1"
            className="stroke-white dark:stroke-ds-neutral-1000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{label}</span>
        {description && (
          <span className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500 text-pretty">{description}</span>
        )}
      </div>
    </label>
  );
}
