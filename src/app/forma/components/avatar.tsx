import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { wh: string; text: string }> = {
  sm: { wh: "w-6 h-6",   text: "text-[10px] leading-none" },
  md: { wh: "w-8 h-8",   text: "text-[12px] leading-none" },
  lg: { wh: "w-10 h-10", text: "text-[14px] leading-none" },
};

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0 bg-ds-neutral-100 dark:bg-ds-neutral-800 flex items-center justify-center",
        s.wh,
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? fallback ?? ""} className="w-full h-full object-cover" />
      ) : (
        <span className={cn("font-medium font-sans text-ds-neutral-600 dark:text-ds-neutral-400 select-none", s.text)}>
          {(fallback ?? "?").slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
