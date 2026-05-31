"use client";

import { useState } from "react";

const ICON_TRANSITION =
  "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), filter 150ms cubic-bezier(0.23,1,0.32,1)";

interface ColorSwatchProps {
  label: string;
  hex: string;
}

export function ColorSwatch({ label, hex }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-white dark:bg-ds-neutral-950 border border-black/16 dark:border-white/16 flex flex-col gap-2 items-start overflow-clip p-2 relative rounded-xl">
      <div className="relative rounded-md shrink-0 w-full" style={{ backgroundColor: hex, height: "88px" }}>
        <button
          aria-label={`Copy ${hex}`}
          onClick={handleCopy}
          className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-white/80 enabled:hover:bg-white flex items-center justify-center transition-[background-color,scale] duration-150 ease-ds enabled:active:scale-[0.96] enabled:cursor-pointer disabled:cursor-not-allowed select-none"
        >
          <div className="relative w-3.5 h-3.5">
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: copied ? 1 : 0,
                transform: copied ? "scale(1)" : "scale(0.25)",
                filter: copied ? "blur(0px)" : "blur(4px)",
                transition: ICON_TRANSITION,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                opacity: copied ? 0 : 1,
                transform: copied ? "scale(0.25)" : "scale(1)",
                filter: copied ? "blur(4px)" : "blur(0px)",
                transition: ICON_TRANSITION,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </div>
          </div>
        </button>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{label}</p>
        <p className="text-ds-body font-mono text-ds-neutral-600 dark:text-ds-neutral-500">{hex}</p>
      </div>
    </div>
  );
}
