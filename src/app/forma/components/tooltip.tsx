"use client";

import { useState, useCallback, useRef, useId } from "react";
import { cn } from "@/lib/utils";

export type TooltipSide = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content: string;
  side?: TooltipSide;
  children: React.ReactNode;
  className?: string;
}

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const DELAY = 200;

const SIDES = {
  top:    { pos: { bottom: "calc(100% + 8px)", left: "50%" },  enter: "translateX(-50%) translateY(0px)",  exit: "translateX(-50%) translateY(4px)"  },
  bottom: { pos: { top:    "calc(100% + 8px)", left: "50%" },  enter: "translateX(-50%) translateY(0px)",  exit: "translateX(-50%) translateY(-4px)" },
  left:   { pos: { right:  "calc(100% + 8px)", top:  "50%" },  enter: "translateY(-50%) translateX(0px)",  exit: "translateY(-50%) translateX(4px)"  },
  right:  { pos: { left:   "calc(100% + 8px)", top:  "50%" },  enter: "translateY(-50%) translateX(0px)",  exit: "translateY(-50%) translateX(-4px)" },
} satisfies Record<TooltipSide, { pos: React.CSSProperties; enter: string; exit: string }>;

export function Tooltip({ content, side = "top", children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), DELAY);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const cfg = SIDES[side];

  return (
    <span className="relative inline-flex">
      <span onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} aria-describedby={id}>
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        aria-hidden={!visible}
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[200px]",
          "px-2 py-1 rounded-[4px]",
          "font-sans text-[13px] leading-[18px] font-medium",
          "bg-[#111111] text-white dark:bg-white dark:text-[#111111]",
          className,
        )}
        style={{
          ...cfg.pos,
          opacity:    visible ? 1 : 0,
          transform:  visible ? cfg.enter : cfg.exit,
          transition: `opacity 150ms ${EASE}, transform 150ms ${EASE}`,
        }}
      >
        {content}
      </span>
    </span>
  );
}
