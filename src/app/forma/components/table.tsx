"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  rows: T[];
  className?: string;
}

export function Table<T extends object>({ columns, rows, className }: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : rows;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-black/8 dark:border-white/8">
            {columns.map((col) => {
              const isActive = sortKey === col.key;
              return (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "pb-3 pr-8 last:pr-0 cursor-pointer select-none",
                    "text-ds-body font-medium",
                    "text-ds-neutral-1000 dark:text-ds-neutral-0",
                    col.align === "right"  ? "text-right"  :
                    col.align === "center" ? "text-center" : "text-left",
                  )}
                >
                  <span className="inline-flex items-center gap-[5px]">
                    {col.label}
                    <span
                      aria-hidden
                      className={cn("transition-opacity duration-150", isActive ? "opacity-100" : "opacity-0")}
                    >
                      {sortDir === "asc" ? (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M4 1.5L1 5.5M4 1.5L7 5.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M4 6.5L1 2.5M4 6.5L7 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/6 dark:divide-white/6">
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    "py-3 pr-8 last:pr-0",
                    "text-ds-body font-medium",
                    "text-ds-neutral-600 dark:text-ds-neutral-500",
                    col.align === "right"  ? "text-right"  :
                    col.align === "center" ? "text-center" : "text-left",
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
