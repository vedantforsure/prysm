"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";

interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  segments,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const [selected, setSelected] = useState<T>(defaultValue ?? segments[0]?.value);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const segmentRefs = useRef<Map<T, HTMLButtonElement>>(new Map());

  useLayoutEffect(() => {
    const el = segmentRefs.current.get(selected);
    if (!el) return;
    setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [selected]);

  const handleSelect = (value: T) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "relative flex items-center self-start p-1 rounded-full bg-ds-neutral-100 dark:bg-ds-neutral-800 border border-black/8 dark:border-white/8",
        className,
      )}
    >
      {pillStyle && (
        <div
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full bg-ds-neutral-1000 dark:bg-ds-neutral-0 pointer-events-none"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            transition: "left 200ms cubic-bezier(0.23, 1, 0.32, 1), width 200ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      )}

      {segments.map((seg) => {
        const active = selected === seg.value;
        return (
          <button
            key={seg.value}
            ref={(el) => {
              if (el) segmentRefs.current.set(seg.value, el);
              else segmentRefs.current.delete(seg.value);
            }}
            onClick={() => handleSelect(seg.value)}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 px-4 py-3 rounded-full",
              "text-ds-body font-medium",
              "transition-[color,scale] duration-150 ease-ds",
              "active:scale-[0.96] cursor-pointer select-none",
              active
                ? "text-ds-neutral-0 dark:text-ds-neutral-1000"
                : "text-ds-neutral-600 dark:text-ds-neutral-400 hfine:hover:text-ds-neutral-1000 dark:hfine:hover:text-ds-neutral-0",
            )}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
