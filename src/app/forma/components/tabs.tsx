"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultValue, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    const idx = tabs.findIndex((t) => t.value === active);
    const el = tabRefs.current[idx];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }
  }, [active, tabs]);

  function handleSelect(value: string) {
    setActive(value);
    onChange?.(value);
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-end">
        <div
          className="absolute bottom-0 h-[1.5px] bg-ds-neutral-1000 dark:bg-ds-neutral-0 rounded-full"
          style={{
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.ready ? 1 : 0,
            transition: indicator.ready
              ? "left 150ms cubic-bezier(0.23, 1, 0.32, 1), width 150ms cubic-bezier(0.23, 1, 0.32, 1)"
              : "none",
          }}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            onClick={() => handleSelect(tab.value)}
            className={cn(
              "px-3 pb-2 cursor-pointer select-none whitespace-nowrap",
              "text-ds-body font-medium",
              "transition-colors duration-150 ease-ds",
              active === tab.value
                ? "text-ds-neutral-1000 dark:text-ds-neutral-0"
                : "text-ds-neutral-450 hfine:hover:text-ds-neutral-700 dark:hfine:hover:text-ds-neutral-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
