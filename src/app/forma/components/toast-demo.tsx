"use client";

import { toast } from "sonner";

const VARIANTS = [
  { label: "Default",  action: () => toast("Event has been created.") },
  { label: "Success",  action: () => toast.success("Changes saved.") },
  { label: "Error",    action: () => toast.error("Something went wrong.") },
  { label: "Warning",  action: () => toast.warning("This action is irreversible.") },
  { label: "Promise",  action: () => toast.promise(new Promise(r => setTimeout(r, 2000)), { loading: "Saving…", success: "Saved!", error: "Failed." }) },
] as const;

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      {VARIANTS.map(({ label, action }) => (
        <button
          key={label}
          onClick={action}
          className="inline-flex items-center justify-center rounded-full px-4 py-[10px] font-sans font-medium text-ds-body bg-transparent border border-black/16 dark:border-white/16 text-ds-neutral-1000 dark:text-ds-neutral-0 transition-[opacity,scale] duration-150 active:scale-[0.96] cursor-pointer select-none hfine:hover:opacity-70"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
