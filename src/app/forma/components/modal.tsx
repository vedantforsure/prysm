"use client";

import { useEffect, useState } from "react";
import { IconButton } from "./icon-button";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";
import { DestructiveButton } from "./destructive-button";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 250);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        style={{ opacity: visible ? 1 : 0, transition: `opacity 200ms ${EASE}` }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="modal-title"
        className="relative w-full max-w-[500px] bg-white dark:bg-neutral-900 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] flex flex-col gap-5 p-5"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "scale(1) translateY(0px)" : "scale(0.96) translateY(8px)",
          transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="modal-title" className="font-sans text-ds-h1 font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">
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
        {description && (
          <p className="font-sans text-ds-body font-medium text-ds-neutral-600 dark:text-ds-neutral-500">
            {description}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={onClose}>{cancelLabel}</SecondaryButton>
          {destructive
            ? <DestructiveButton onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</DestructiveButton>
            : <PrimaryButton onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</PrimaryButton>
          }
        </div>
      </div>
    </div>
  );
}
