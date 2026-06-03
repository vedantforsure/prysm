"use client";

import { sounds } from "@/lib/sounds";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={sounds.buttonPrimary}
      disabled={disabled}
      className={`text-body inline-flex h-10 items-center justify-center px-4 select-none text-white transition-[transform,opacity] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hfine:hover:opacity-90 active:scale-[0.96] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        background: "#e63d96",
        borderRadius: "100px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.10)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        color: "white",
        fontSize: "16px",
        lineHeight: "20px",
        fontWeight: 400,
      }}
    >
      {children}
    </button>
  );
}
