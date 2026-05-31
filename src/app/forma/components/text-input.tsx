"use client";

import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
}

export function TextInput({ label, className, id, error, success, loading, disabled, onChange, ...props }: TextInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const isDisabled = disabled || loading;
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(() => {
    const initial = props.value ?? props.defaultValue;
    return typeof initial === "string" ? initial.length > 0 : false;
  });
  const [shakeKey, setShakeKey] = useState(0);
  const prevError = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (error && error !== prevError.current) setShakeKey(k => k + 1);
    prevError.current = error;
  }, [error]);

  // keep hasValue in sync when controlled value changes externally
  useEffect(() => {
    if (props.value !== undefined) setHasValue(String(props.value).length > 0);
  }, [props.value]);

  const borderColor = error
    ? "border-red-500 dark:border-red-400"
    : success
    ? "border-green-500 dark:border-green-400"
    : "border-black/12";

  const focusBorder = error
    ? "focus:border-red-500 dark:focus:border-red-400"
    : success
    ? "focus:border-green-500 dark:focus:border-green-400"
    : "focus:border-blue-500 dark:focus:border-blue-400";

  const hasRightIcon = loading || success || hasValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  }

  function handleClear() {
    if (!inputRef.current) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(inputRef.current, "");
    inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    // also fire a synthetic React change event
    const syntheticEvent = { target: inputRef.current, currentTarget: inputRef.current } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    setHasValue(false);
    inputRef.current.focus();
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={inputId}
        className={cn(
          "text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0 transition-opacity duration-150",
          isDisabled && "opacity-40",
        )}
      >
        {label}
      </label>
      <div key={shakeKey} className={cn("relative", error && "animate-shake")}>
        <input
          ref={inputRef}
          id={inputId}
          disabled={isDisabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={handleChange}
          className={cn(
            "w-full rounded-full px-4 py-2",
            "border-[1.5px] dark:border-white/12",
            borderColor,
            "text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0",
            "placeholder:text-ds-neutral-500 dark:placeholder:text-ds-neutral-600",
            "bg-white dark:bg-ds-neutral-950",
            "outline-none transition-colors duration-150",
            focusBorder,
            isDisabled && "opacity-40 cursor-not-allowed",
            hasRightIcon && "pr-10",
            className,
          )}
          {...props}
        />

        {/* Right icon: priority order — loading > success > clear */}
        {loading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="animate-spin w-4 h-4 text-ds-neutral-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : success ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : hasValue && !isDisabled ? (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-ds-neutral-300 dark:bg-ds-neutral-700 hfine:hover:bg-ds-neutral-400 dark:hfine:hover:bg-ds-neutral-600 transition-colors duration-150 cursor-pointer"
          >
            <svg className="w-2.5 h-2.5 text-ds-neutral-700 dark:text-ds-neutral-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-ds-caption text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
