"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../components/PrimaryButton";

// ─── Tree data ────────────────────────────────────────────────────────────────

const TREE = [
  {
    category: "Actions",
    components: [
      { name: "PrimaryButton", variants: ["Default", "Loading", "Disabled"] },
      { name: "SecondaryButton", variants: ["Default", "Destructive"] },
    ],
  },
  {
    category: "Display",
    components: [
      { name: "ProjectCard", variants: ["Default", "Hover"] },
      { name: "Badge", variants: ["Neutral", "Success", "Error"] },
    ],
  },
  {
    category: "Inputs",
    components: [
      { name: "TextInput", variants: ["Default", "Error", "Disabled"] },
    ],
  },
];

function ComponentTree() {
  const [openCategory, setOpenCategory] = useState<string>("Actions");
  const [openComponent, setOpenComponent] = useState<string>("");
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [activeVariant, setActiveVariant] = useState<string>("");
  const btnBase = "select-none text-left text-caption min-h-[32px] rounded-md px-2 py-1 active:scale-[0.96] transition-[color,background-color,scale] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:bg-[#eeeeee] active:bg-[#bbbbbb]";
  const btnStyle = { WebkitTapHighlightColor: "transparent" as const, touchAction: "manipulation" as const };

  return (
    <nav className="hidden lg:flex fixed bottom-6 left-6 z-50 flex-col gap-0.5 hero-fade hero-fade-2">
      <div className="flex flex-col gap-1">
        {TREE.map(({ category, components }) => {
          const isOpen = openCategory === category;
          return (
            <div key={category} className="flex flex-col gap-0.5">
              <button
                onClick={() => { setOpenCategory(isOpen ? "" : category); if (isOpen) { setOpenComponent(""); setActiveComponent(""); setActiveVariant(""); } }}
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
                    {components.map(({ name, variants }, i) => (
                      <div
                        key={name}
                        className="flex flex-col gap-0.5"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1)",
                          transitionDelay: isOpen ? `${i * 35}ms` : "0ms",
                        }}
                      >
                        <button
                          onClick={() => { const closing = openComponent === name; setOpenComponent(closing ? "" : name); setActiveComponent(closing ? "" : name); setActiveVariant(""); }}
                          className={btnBase}
                          style={{ ...btnStyle, color: activeComponent === name ? "#000000" : "#666666" }}
                        >
                          {name}
                        </button>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateRows: openComponent === name ? "1fr" : "0fr",
                            transition: openComponent === name
                              ? "grid-template-rows 250ms cubic-bezier(0.23,1,0.32,1)"
                              : "grid-template-rows 180ms cubic-bezier(0.32,0.72,0,1)",
                          }}
                        >
                          <div style={{ overflow: "hidden" }}>
                            <div className="flex flex-col gap-0.5 ml-2 pl-3" style={{ borderLeft: "2.5px solid #dddddd" }}>
                              {variants.map((variant, vi) => (
                                <button
                                  key={variant}
                                  onClick={() => { setActiveVariant(variant); setActiveComponent(name); }}
                                  className={btnBase}
                                  style={{
                                    ...btnStyle,
                                    color: activeVariant === variant ? "#000000" : "#666666",
                                    opacity: openComponent === name ? 1 : 0,
                                    transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1), color 150ms cubic-bezier(0.23,1,0.32,1), background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
                                    transitionDelay: openComponent === name ? `${vi * 25}ms` : "0ms",
                                    pointerEvents: openComponent === name ? "auto" : "none",
                                  }}
                                >
                                  {variant}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
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
    <div className="flex flex-col gap-3">
      {/* Label */}
      <div className="flex flex-col gap-1">
        <p className="text-body" style={{ color: "#000000" }}>{name}</p>
        <p className="text-body">{description}</p>
      </div>

      {/* Preview box */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          transition: "background 200ms cubic-bezier(0.23,1,0.32,1)",
          background: dark ? "#111111" : "#f7f7f7",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-3"
          style={{
            borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          {/* Dark/light toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="select-none inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium transition-colors duration-150"
            style={{
              fontFamily: "var(--font-geist-sans)",
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: dark ? "#e5e5e5" : "#555555",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
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
            className="select-none inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium transition-colors duration-150"
            style={{
              fontFamily: "var(--font-geist-sans)",
              background: showCode
                ? dark ? "#0088ff" : "#0088ff"
                : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: showCode ? "#ffffff" : dark ? "#e5e5e5" : "#555555",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>
        </div>

        {/* Component preview */}
        <div className="flex items-center justify-center flex-wrap gap-4 px-6 py-10 sm:py-14">
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
                className="select-none absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
                  color: dark ? "#aaaaaa" : "#666666",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
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
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
          <ComponentSection
            name="PrimaryButton"
            description="The main call-to-action button. Gradient fill, pill shape, subtle press scale."
            code={`<PrimaryButton>Get started</PrimaryButton>\n\n<PrimaryButton>Save changes</PrimaryButton>`}
          >
            <PrimaryButton>Get started</PrimaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </ComponentSection>
        </section>
      </div>
    </main>
  );
}
