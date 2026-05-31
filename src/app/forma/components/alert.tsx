import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  className?: string;
}

export function Alert({ variant, title, description, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-xl border px-5 py-4 flex flex-col gap-1", className)}
      style={{
        backgroundColor: `var(--alert-${variant}-bg)`,
        borderColor:     `var(--alert-${variant}-border)`,
        color:           `var(--alert-${variant}-text)`,
      }}
    >
      <span className="font-sans text-ds-body font-medium">
        {title}
      </span>
      {description && (
        <span className="font-sans text-ds-body font-medium opacity-80">
          {description}
        </span>
      )}
    </div>
  );
}
