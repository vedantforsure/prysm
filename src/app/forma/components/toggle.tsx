"use client";

import { useState, useId } from "react";

interface ToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({ label, description, defaultChecked = false, onChange }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const id = useId();

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={toggle}
        className={[
          "relative w-10 h-6 rounded-full shrink-0 mt-[2px] cursor-pointer border-[1.5px]",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40",
          "active:scale-[0.96]",
          checked
            ? "bg-ds-neutral-1000 dark:bg-ds-neutral-0 border-transparent"
            : "bg-white dark:bg-ds-neutral-950 border-black/20 dark:border-white/20",
        ].join(" ")}
        style={{ transition: "background-color 150ms cubic-bezier(0.23,1,0.32,1), border-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)" }}
      >
        <span
          aria-hidden
          className={[
            "absolute top-[3px] left-[3px] w-4 h-4 rounded-full",
            checked ? "bg-white dark:bg-ds-neutral-1000" : "bg-ds-neutral-300 dark:bg-ds-neutral-600",
          ].join(" ")}
          style={{
            transform: checked ? "translateX(16px)" : "translateX(0px)",
            transition: "transform 200ms cubic-bezier(0.23,1,0.32,1), background-color 150ms cubic-bezier(0.23,1,0.32,1)",
          }}
        />
      </button>
      <div className="flex flex-col gap-0.5 cursor-pointer" onClick={toggle}>
        <span className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{label}</span>
        {description && (
          <span className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500 text-pretty">{description}</span>
        )}
      </label>
    </div>
  );
}
