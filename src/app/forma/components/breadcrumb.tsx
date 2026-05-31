import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center">
            {isLast ? (
              <span
                aria-current="page"
                className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0"
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href ?? "#"}
                className="text-ds-body font-medium text-ds-neutral-450 transition-colors duration-150 ease-ds hfine:hover:text-ds-neutral-700 dark:hfine:hover:text-ds-neutral-300"
              >
                {item.label}
              </a>
            )}
            {!isLast && (
              <span
                aria-hidden
                className="mx-[6px] text-ds-body font-medium text-ds-neutral-300 dark:text-ds-neutral-700 select-none"
              >
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
