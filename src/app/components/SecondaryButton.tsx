"use client";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({ children, onClick, className = "" }: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-body inline-flex h-11 min-w-[40px] items-center justify-center rounded-full px-4 select-none transition-[background-color,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hfine:hover:bg-[#eeeeee] active:scale-[0.96] active:bg-[#bbbbbb] active:![color:#000000] ${className}`}
    >
      {children}
    </button>
  );
}
