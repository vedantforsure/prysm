"use client";

import { useState, useId } from "react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ label, options, defaultValue = "", onChange }: RadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue);
  const name = useId();

  const handleChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{label}</p>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
              <input type="radio" name={name} value={opt.value} checked={isSelected} onChange={() => handleChange(opt.value)} className="sr-only" />
              <div
                aria-hidden
                data-checked={isSelected}
                className={[
                  "w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 mt-[3px]",
                  "transition-[border-color] duration-150 ease-ds",
                  isSelected
                    ? "border-ds-neutral-1000 dark:border-ds-neutral-0"
                    : "bg-white dark:bg-ds-neutral-950 border-black/20 dark:border-white/20 hfine:group-hover:border-black/40 dark:hfine:group-hover:border-white/40",
                ].join(" ")}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full bg-ds-neutral-1000 dark:bg-ds-neutral-0"
                  style={{
                    opacity:    isSelected ? 1 : 0,
                    transform:  isSelected ? "scale(1)" : "scale(0.25)",
                    filter:     isSelected ? "blur(0px)" : "blur(4px)",
                    transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), filter 150ms cubic-bezier(0.23,1,0.32,1)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{opt.label}</span>
                {opt.description && (
                  <span className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500 text-pretty">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
