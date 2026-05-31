"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

type PopoverSide = "top" | "bottom" | "left" | "right";
type PopoverAlign = "start" | "center" | "end";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  className?: string;
}

const sidePos: Record<PopoverSide, { pos: string; enter: string; exit: string }> = {
  top:    { pos: "bottom-full mb-2", enter: "translateY(0px)",  exit: "translateY(4px)"  },
  bottom: { pos: "top-full mt-2",    enter: "translateY(0px)",  exit: "translateY(-4px)" },
  left:   { pos: "right-full mr-2",  enter: "translateX(0px)",  exit: "translateX(4px)"  },
  right:  { pos: "left-full ml-2",   enter: "translateX(0px)",  exit: "translateX(-4px)" },
};

const alignClass: Record<PopoverAlign, string> = {
  start:  "left-0",
  center: "left-1/2 -translate-x-1/2",
  end:    "right-0",
};

export function Popover({ trigger, children, side = "bottom", align = "start", className }: PopoverProps) {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 180);
  }, []);

  const toggle = useCallback(() => {
    if (open) hide(); else show();
  }, [open, hide, show]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) hide();
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onPointer);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, hide]);

  const cfg = sidePos[side];

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute z-40 w-max max-w-[calc(100vw-40px)]",
            cfg.pos,
            alignClass[align],
            "bg-white dark:bg-neutral-900",
            "border border-black/[0.08] dark:border-white/[0.08]",
            "rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
            className,
          )}
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? cfg.enter : cfg.exit,
            transition: `opacity 180ms ${EASE}, transform 180ms ${EASE}`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
