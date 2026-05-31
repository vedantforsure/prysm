import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  dot?: boolean;
  className?: string;
}

export function Badge({ variant = "neutral", label, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[6px] px-2 py-[3px] rounded-full border",
        "font-sans text-ds-body font-medium whitespace-nowrap",
        className,
      )}
      style={{
        backgroundColor: `var(--alert-${variant}-bg)`,
        borderColor:     `var(--alert-${variant}-border)`,
        color:           `var(--alert-${variant}-text)`,
      }}
    >
      {dot && <span className="size-[6px] rounded-full bg-current shrink-0" />}
      {label}
    </span>
  );
}
