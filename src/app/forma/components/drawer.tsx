"use client";

import { useEffect, useState } from "react";
import { IconButton } from "./icon-button";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "bottom";
  title: string;
  children?: React.ReactNode;
}

export function Drawer({ open, onClose, side = "right", title, children }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const isRight = side === "right";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          background: isRight
            ? "linear-gradient(to left, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.02) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.02) 100%)",
          opacity:    visible ? 1 : 0,
          transition: `opacity 250ms ${EASE}`,
        }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="drawer-title"
        className="absolute bg-white dark:bg-neutral-900 flex flex-col rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        style={{
          ...(isRight
            ? { top: 12, right: 12, bottom: 12, width: 360 }
            : { bottom: 12, left: 12, right: 12, maxHeight: "60vh" }),
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translate(0,0)" : isRight ? "translateX(calc(100% + 12px))" : "translateY(calc(100% + 12px))",
          transition: `opacity 300ms ${EASE}, transform 300ms ${EASE}`,
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
          <h2 id="drawer-title" className="font-sans text-ds-h1 font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">
            {title}
          </h2>
          <IconButton
            label="Close"
            onClick={onClose}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
