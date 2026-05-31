"use client";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-body inline-flex h-11 items-center justify-center px-4 select-none text-white transition-[transform,opacity] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:opacity-90 active:scale-[0.96]"
      style={{
        background: "linear-gradient(rgb(112, 169, 255) 0%, rgb(0, 95, 237) 50.4808%)",
        borderRadius: "100px",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 4px 0px",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        color: "white",
      }}
    >
      {children}
    </button>
  );
}
