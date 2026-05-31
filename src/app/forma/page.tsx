"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ─── Tree data ────────────────────────────────────────────────────────────────

const TREE = [
  {
    category: "Foundations",
    components: ["Colors", "Typography", "Spacing", "Shadows", "Motion"],
  },
  {
    category: "Actions",
    components: ["PrimaryButton", "SecondaryButton", "GhostButton", "DestructiveButton", "IconButton"],
  },
  {
    category: "Display",
    components: ["ProjectCard", "Badge"],
  },
  {
    category: "Inputs",
    components: ["TextInput"],
  },
];

// ─── Foundations data ─────────────────────────────────────────────────────────

const NEUTRALS = [
  { token: "0",    hex: "#ffffff" },
  { token: "50",   hex: "#f9f9f9" },
  { token: "100",  hex: "#f2f2f2" },
  { token: "200",  hex: "#e0e0e0" },
  { token: "300",  hex: "#c8c8c8" },
  { token: "400",  hex: "#bbbbbb" },
  { token: "500",  hex: "#888888" },
  { token: "600",  hex: "#666666" },
  { token: "700",  hex: "#444444" },
  { token: "800",  hex: "#333333" },
  { token: "900",  hex: "#1a1a1a" },
  { token: "950",  hex: "#111111" },
  { token: "1000", hex: "#000000" },
];

const SEMANTIC_COLORS = [
  { label: "Destructive", hex: "#FF0000" },
  { label: "Success",     hex: "#00CC44" },
  { label: "Warning",     hex: "#FF9900" },
  { label: "Info",        hex: "#2979FF" },
];

const SPACING_TOKENS = [
  { name: "xs", px: 4,   usage: "Label to content" },
  { name: "sm", px: 8,   usage: "Heading to content, between buttons" },
  { name: "md", px: 12,  usage: "Related fields within a group" },
  { name: "lg", px: 20,  usage: "Subsections within a component, card padding" },
  { name: "xl", px: 100, usage: "Major page sections" },
];

const SHADOW_TOKENS = [
  { name: "sm", value: "0 1px 2px rgba(0,0,0,0.04)",  usage: "Inputs, subtle lift" },
  { name: "md", value: "0 2px 8px rgba(0,0,0,0.06)",  usage: "Cards, dropdowns" },
  { name: "lg", value: "0 4px 16px rgba(0,0,0,0.08)", usage: "Modals, panels" },
  { name: "xl", value: "0 8px 32px rgba(0,0,0,0.10)", usage: "Large overlays" },
];

const MOTION_TOKENS = [
  { name: "Fast", duration: "100ms", easing: "cubic-bezier(0.23, 1, 0.32, 1)", usage: "Icon swaps, indicators" },
  { name: "Base", duration: "150ms", easing: "cubic-bezier(0.23, 1, 0.32, 1)", usage: "Color, opacity, borders" },
  { name: "Slow", duration: "300ms", easing: "cubic-bezier(0.77, 0, 0.175, 1)", usage: "Layout shifts, reveals" },
];

const TYPE_SCALE = [
  { name: "Display",  size: "30px", lh: "32px", ls: "−0.6px", weight: "500", sample: "The quick brown fox" },
  { name: "H1",       size: "24px", lh: "30px", ls: "−0.2px", weight: "500", sample: "The quick brown fox" },
  { name: "H2",       size: "16px", lh: "20px", ls: "—",      weight: "500", sample: "The quick brown fox" },
  { name: "Body",     size: "16px", lh: "20px", ls: "—",      weight: "500", sample: "The quick brown fox jumps over the lazy dog", muted: true },
  { name: "Small",    size: "14px", lh: "18px", ls: "—",      weight: "500", sample: "The quick brown fox jumps over the lazy dog", muted: true },
  { name: "Buttons",  size: "16px", lh: "20px", ls: "—",      weight: "500", sample: "Button label" },
];

// ─── Forma component imports ───────────────────────────────────────────────────

import { PrimaryButton } from "./components/primary-button";
import { SecondaryButton } from "./components/secondary-button";
import { GhostButton } from "./components/ghost-button";
import { DestructiveButton } from "./components/destructive-button";
import { IconButton } from "./components/icon-button";
import { ColorSwatch } from "./components/color-swatch";
import { MotionSwatch } from "./components/motion-swatch";

function ComponentTree() {
  const [openCategory, setOpenCategory] = useState<string>("Actions");
  const [activeComponent, setActiveComponent] = useState<string>("");

  const btnBase = "select-none w-fit text-left text-ds-body font-medium rounded-md px-3 py-2 active:scale-[0.96] transition-[color,background-color,scale] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:bg-[#eeeeee] active:bg-[#bbbbbb]";
  const btnStyle = { WebkitTapHighlightColor: "transparent" as const, touchAction: "manipulation" as const };

  return (
    <nav className="hidden lg:flex fixed bottom-6 left-6 z-50 flex-col gap-0.5 hero-fade hero-fade-2">
      <div className="flex flex-col gap-0.5">
        {TREE.map(({ category, components }) => {
          const isOpen = openCategory === category;
          return (
            <div key={category} className="flex flex-col gap-0.5">
              <button
                onClick={() => { setOpenCategory(isOpen ? "" : category); if (isOpen) { setActiveComponent(""); } }}
                className={btnBase}
                style={{ ...btnStyle, color: isOpen ? "#000000" : "#666666" }}
              >
                {category}
              </button>

              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: isOpen
                    ? "grid-template-rows 250ms cubic-bezier(0.23,1,0.32,1)"
                    : "grid-template-rows 180ms cubic-bezier(0.32,0.72,0,1)",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div className="flex flex-col gap-0.5 ml-2 pl-3 pb-1" style={{ borderLeft: "2.5px solid #dddddd" }}>
                    {components.map((name, i) => (
                      <button
                        key={name}
                        onClick={() => {
                          setActiveComponent(name);
                          const id = name.toLowerCase().replace(/\s+/g, "-");
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={btnBase}
                        style={{
                          ...btnStyle,
                          color: activeComponent === name ? "#000000" : "#666666",
                          opacity: isOpen ? 1 : 0,
                          transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1), color 150ms cubic-bezier(0.23,1,0.32,1), background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
                          transitionDelay: isOpen ? `${i * 35}ms` : "0ms",
                          pointerEvents: isOpen ? "auto" : "none",
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComponentSectionProps {
  name: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

// ─── ComponentSection ─────────────────────────────────────────────────────────

function ComponentSection({ name, description, code, children }: ComponentSectionProps) {
  const id = name.toLowerCase().replace(/\s+/g, "-");
  const [dark, setDark] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div id={id} className="flex flex-col gap-3 scroll-mt-8">
      {/* Label */}
      <div className="flex flex-col gap-1">
        <p className="text-body" style={{ color: "#000000" }}>{name}</p>
        <p className="text-body">{description}</p>
      </div>

      {/* Preview box */}
      <div
        className={`rounded-2xl overflow-hidden border ${dark ? "border-white/16" : "border-black/16"}`}
        style={{
          transition: "background 200ms cubic-bezier(0.23,1,0.32,1)",
          background: dark ? "#000000" : "#ffffff",
        }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2 px-4 py-3">
          {/* Dark/light toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className={`select-none inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans font-medium text-ds-body whitespace-nowrap border transition-[background-color,scale] duration-150 ease-ds active:scale-[0.96] cursor-pointer ${
              dark
                ? "bg-ds-neutral-950 border-white/16 text-white hfine:hover:bg-ds-neutral-900 active:bg-ds-neutral-700"
                : "bg-white border-black/16 text-black hfine:hover:bg-ds-neutral-100 active:bg-ds-neutral-400"
            }`}
          >
            {dark ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {dark ? "Light" : "Dark"}
          </button>

          {/* Code toggle */}
          <button
            onClick={() => setShowCode((s) => !s)}
            className={`select-none inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans font-medium text-ds-body whitespace-nowrap border transition-[background-color,scale] duration-150 ease-ds active:scale-[0.96] cursor-pointer ${
              showCode
                ? "bg-[#0088ff] border-[#0088ff] text-white"
                : dark
                  ? "bg-ds-neutral-950 border-white/16 text-white hfine:hover:bg-ds-neutral-900 active:bg-ds-neutral-700"
                  : "bg-white border-black/16 text-black hfine:hover:bg-ds-neutral-100 active:bg-ds-neutral-400"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>
        </div>

        {/* Component preview */}
        <div className={`flex items-center justify-center flex-wrap gap-4 px-6 py-10 sm:py-14${dark ? " dark" : ""}`}>
          {children}
        </div>

        {/* Code panel */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: showCode ? "1fr" : "0fr",
            transition: "grid-template-rows 300ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                position: "relative",
              }}
            >
              {/* Copy button */}
              <button
                onClick={copy}
                className={`select-none absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans font-medium text-ds-body whitespace-nowrap border transition-[background-color,scale,color,border-color] duration-150 ease-ds active:scale-[0.96] cursor-pointer ${
                  copied
                    ? "bg-[#00CC44] border-[#00CC44] text-white"
                    : dark
                      ? "bg-ds-neutral-950 border-white/16 text-white hfine:hover:bg-ds-neutral-900 active:bg-ds-neutral-700"
                      : "bg-white border-black/16 text-black hfine:hover:bg-ds-neutral-100 active:bg-ds-neutral-400"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>

              <pre
                ref={codeRef}
                className="overflow-x-auto px-5 py-4 text-[13px] leading-6"
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  color: dark ? "#cccccc" : "#333333",
                  whiteSpace: "pre",
                  tabSize: 2,
                }}
              >
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormaPage() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      {/* Back link — fixed top-left, above scroll mask */}
      <div className="fixed top-5 left-5 z-50 hero-fade hero-fade-1">
        <Link
          href="/"
          className="select-none inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-body transition-[background-color,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:bg-[#eeeeee] active:scale-[0.96] active:bg-[#bbbbbb]"
          style={{
            fontSize: "16px",
            color: "#171717",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
      </div>

      {/* Component tree — fixed bottom-left, hidden on small screens */}
      <ComponentTree />

      <div className="mx-auto w-full max-w-[700px] px-4 sm:px-0">
        {/* Hero */}
        <section className="py-[40px] sm:py-[60px] flex flex-col gap-3">
          <h1
            className="text-display hero-fade hero-fade-1 self-start"
            style={{
              lineHeight: "0.9",
              background:
                "linear-gradient(to right, rgba(0,136,255,0.3) 0%, #0088ff 35%, #0088ff 75%, rgba(0,136,255,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Forma
          </h1>
          <p className="text-body hero-fade hero-fade-2" style={{ maxWidth: "520px" }}>
            A minimal, opinionated design system for React apps. Every component is built with the same easing, timing, and interaction model — so your UI feels coherent without extra effort.
          </p>
        </section>

        {/* Component sections */}
        <section className="flex flex-col gap-12 pb-[80px] sm:pb-[120px]">

          {/* ── Colors ── */}
          <ComponentSection
            name="Colors"
            description="A single neutral scale from white to black, plus four semantic colors for status communication."
            code={`:root {
  /* Neutral scale */
  --ds-neutral-0:    #ffffff;
  --ds-neutral-50:   #f9f9f9;
  --ds-neutral-100:  #f2f2f2;
  --ds-neutral-200:  #e0e0e0;
  --ds-neutral-300:  #c8c8c8;
  --ds-neutral-400:  #bbbbbb;
  --ds-neutral-500:  #888888;
  --ds-neutral-600:  #666666;
  --ds-neutral-700:  #444444;
  --ds-neutral-800:  #333333;
  --ds-neutral-900:  #1a1a1a;
  --ds-neutral-950:  #111111;
  --ds-neutral-1000: #000000;

  /* Semantic */
  --ds-destructive: #FF0000;
  --ds-success:     #00CC44;
  --ds-warning:     #FF9900;
  --ds-info:        #2979FF;
}`}
          >
            <div className="w-full flex flex-col gap-6">
              <div>
                <p className="text-ds-body text-ds-neutral-1000 dark:text-ds-neutral-0 mb-3">Neutral</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {NEUTRALS.map(({ token, hex }) => (
                    <ColorSwatch key={token} label={`neutral-${token}`} hex={hex} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ds-body text-ds-neutral-1000 dark:text-ds-neutral-0 mb-3">Semantic</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SEMANTIC_COLORS.map(({ label, hex }) => (
                    <ColorSwatch key={label} label={label} hex={hex} />
                  ))}
                </div>
              </div>
            </div>
          </ComponentSection>

          {/* ── Typography ── */}
          <ComponentSection
            name="Typography"
            description="Six steps covering every surface from hero headings to captions. All weights are 500 — a single weight keeps the system coherent."
            code={`@theme inline {
  --text-ds-display: 30px;
  --text-ds-display--line-height: 32px;
  --text-ds-display--letter-spacing: -0.6px;

  --text-ds-h1: 24px;
  --text-ds-h1--line-height: 30px;
  --text-ds-h1--letter-spacing: -0.2px;

  --text-ds-h2: 16px;
  --text-ds-h2--line-height: 20px;

  --text-ds-body: 16px;
  --text-ds-body--line-height: 20px;

  --text-ds-body: 14px;
  --text-ds-body--line-height: 18px;

  --text-ds-buttons: 16px;
  --text-ds-buttons--line-height: 20px;
}`}
          >
            <div className="w-full divide-y divide-black/6 dark:divide-white/6">
              {TYPE_SCALE.map(({ name, size, lh, ls, sample, muted }) => (
                <div key={name} className="flex items-baseline justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <p
                    className="text-ds-neutral-1000 dark:text-ds-neutral-0 flex-1 min-w-0 truncate"
                    style={{ fontSize: size, lineHeight: lh, fontWeight: 500, fontFamily: "var(--font-geist-sans)" }}
                  >
                    {sample}
                  </p>
                  <div className="shrink-0 flex items-center gap-4 text-ds-body font-mono text-ds-neutral-600 dark:text-ds-neutral-500 tabular-nums">
                    <span className="hidden sm:inline font-sans font-medium text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500">{name}</span>
                    <span>{size}/{lh}</span>
                    <span>{ls}</span>
                  </div>
                </div>
              ))}
            </div>
          </ComponentSection>

          {/* ── Spacing ── */}
          <ComponentSection
            name="Spacing"
            description="Five steps covering the full range from tight label gaps to major page sections."
            code={`:root {
  --spacing-xs:  4px;   /* gap between label and content */
  --spacing-sm:  8px;   /* gap between heading and content, between buttons */
  --spacing-md:  12px;  /* related fields within a group */
  --spacing-lg:  20px;  /* subsections within a component, card padding */
  --spacing-xl:  100px; /* major page sections */
}`}
          >
            <div className="w-full flex flex-col divide-y divide-black/6 dark:divide-white/6">
              {SPACING_TOKENS.map(({ name, px, usage }) => (
                <div key={name} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0 w-5 shrink-0">{name}</span>
                  <div className="h-2 rounded-[4px] bg-[#0088ff] shrink-0" style={{ width: px }} />
                  <span className="text-ds-body font-mono tabular-nums text-ds-neutral-1000 dark:text-ds-neutral-0 shrink-0">{px}px</span>
                  <span className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500 ml-auto hidden sm:block text-right">{usage}</span>
                </div>
              ))}
            </div>
          </ComponentSection>

          {/* ── Shadows ── */}
          <ComponentSection
            name="Shadows"
            description="Four depth levels built from pure black transparency — they adapt to any background color."
            code={`@theme inline {
  --shadow-ds-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-ds-md: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-ds-lg: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-ds-xl: 0 8px 32px rgba(0, 0, 0, 0.10);
}`}
          >
            <div className="w-full flex flex-wrap gap-6">
              {SHADOW_TOKENS.map(({ name, value, usage }) => (
                <div key={name} className="flex flex-col gap-3 items-start">
                  <div
                    className="w-28 h-28 rounded-2xl bg-white dark:bg-ds-neutral-900"
                    style={{ boxShadow: value }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0">{name}</p>
                    <p className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500">{usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </ComponentSection>

          {/* ── Motion ── */}
          <ComponentSection
            name="Motion"
            description="Three duration steps, two easing curves. Hover each bar to see the easing in action."
            code={`@utility ease-ds {
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

@utility ease-ds-slow {
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
}

/* Usage */
.element {
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
}`}
          >
            <div className="w-full flex flex-col divide-y divide-black/6 dark:divide-white/6">
              {MOTION_TOKENS.map(({ name, duration, easing, usage }) => (
                <div key={name} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="text-ds-body font-medium text-ds-neutral-1000 dark:text-ds-neutral-0 w-8 shrink-0">{name}</span>
                  <MotionSwatch duration={duration} easing={easing} />
                  <span className="text-ds-body font-mono tabular-nums text-ds-neutral-1000 dark:text-ds-neutral-0 shrink-0">{duration}</span>
                  <span className="text-ds-body text-ds-neutral-600 dark:text-ds-neutral-500 ml-auto hidden sm:block text-right">{usage}</span>
                </div>
              ))}
            </div>
          </ComponentSection>

          <ComponentSection
            name="PrimaryButton"
            description="The primary action button. Black fill, pill shape, subtle press scale. Use for the single most important action on a screen."
            code={`"use client";

import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function PrimaryButton({
  children = "Proceed",
  style,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: "9999px",
        border: "1px solid rgba(0,0,0,0.08)",
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#ffffff",
        background: "#000000",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#333333")}
      onMouseLeave={e => (e.currentTarget.style.background = "#000000")}
      onMouseDown={e => (e.currentTarget.style.scale = "0.96")}
      onMouseUp={e => (e.currentTarget.style.scale = "1")}
      {...props}
    >
      {children}
    </button>
  );
}`}
          >
            <PrimaryButton>Proceed</PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </ComponentSection>

          <ComponentSection
            name="SecondaryButton"
            description="Secondary action. White fill with a subtle border. Pairs with PrimaryButton for two-action layouts."
            code={`"use client";

import { ButtonHTMLAttributes } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SecondaryButton({
  children = "Go Back",
  style,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: "9999px",
        border: "1px solid rgba(0,0,0,0.16)",
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#000000",
        background: "#ffffff",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
      onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
      onMouseDown={e => (e.currentTarget.style.scale = "0.96")}
      onMouseUp={e => (e.currentTarget.style.scale = "1")}
      {...props}
    >
      {children}
    </button>
  );
}`}
          >
            <SecondaryButton>Go Back</SecondaryButton>
            <SecondaryButton disabled>Disabled</SecondaryButton>
          </ComponentSection>

          <ComponentSection
            name="GhostButton"
            description="Lowest visual weight. No background or border — text only. Use for tertiary actions that should recede."
            code={`"use client";

import { ButtonHTMLAttributes } from "react";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GhostButton({
  children = "Cancel",
  style,
  ...props
}: GhostButtonProps) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: "9999px",
        border: "none",
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#000000",
        background: "transparent",
        cursor: "pointer",
        userSelect: "none",
        transition: "color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.color = "#555555")}
      onMouseLeave={e => (e.currentTarget.style.color = "#000000")}
      onMouseDown={e => (e.currentTarget.style.scale = "0.96")}
      onMouseUp={e => (e.currentTarget.style.scale = "1")}
      {...props}
    >
      {children}
    </button>
  );
}`}
          >
            <GhostButton>Cancel</GhostButton>
          </ComponentSection>

          <ComponentSection
            name="DestructiveButton"
            description="For irreversible destructive actions like delete or remove. Red fill signals danger clearly."
            code={`"use client";

import { ButtonHTMLAttributes } from "react";

interface DestructiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function DestructiveButton({
  children = "Delete",
  style,
  ...props
}: DestructiveButtonProps) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: "9999px",
        border: "1px solid rgba(0,0,0,0.16)",
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#ffffff",
        background: "#FF0000",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#E00000")}
      onMouseLeave={e => (e.currentTarget.style.background = "#FF0000")}
      onMouseDown={e => (e.currentTarget.style.scale = "0.96")}
      onMouseUp={e => (e.currentTarget.style.scale = "1")}
      {...props}
    >
      {children}
    </button>
  );
}`}
          >
            <DestructiveButton />
          </ComponentSection>

          <ComponentSection
            name="IconButton"
            description="Icon-only action. Fixed 40×40 hit area with a circular hover state. Always include an aria-label."
            code={`"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
}

export function IconButton({
  icon,
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center",
        "w-10 h-10 rounded-full shrink-0",
        "text-black dark:text-white",
        "bg-transparent",
        "transition-[background-color,scale] duration-150 ease-ds",
        "active:scale-[0.96]",
        "hfine:hover:bg-ds-neutral-100 dark:hfine:hover:bg-ds-neutral-100/10",
        "active:bg-ds-neutral-400 dark:active:bg-ds-neutral-400/20",
        "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {icon ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="3" x2="8" y2="13" />
          <line x1="3" y1="8" x2="13" y2="8" />
        </svg>
      )}
    </button>
  );
}`}
          >
            <IconButton label="Add" />
          </ComponentSection>
        </section>
      </div>
    </main>
  );
}
