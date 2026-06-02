"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import SiteSecondaryButton from "../components/SecondaryButton";

const PAGE_LOAD_TIME = Date.now();
const HERO_DONE_MS = 550;

// ─── Tree data ────────────────────────────────────────────────────────────────

const TREE = [
  {
    category: "Projects",
    components: [
      "PSS Pack Order Segregation",
      "CoPub Modal Integration",
      "Insights Page Modal",
      "Landing Pages",
    ],
  },
];

// ─── ComponentTree ────────────────────────────────────────────────────────────

function ComponentTree() {
  const [openCategory, setOpenCategory] = useState<string>("");
  const [activeComponent, setActiveComponent] = useState<string>("");
  const intersectingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const idToMeta: Record<string, { category: string; name: string }> = {};
    const orderedIds: string[] = [];
    TREE.forEach(({ category, components }) => {
      components.forEach((name) => {
        const id = name.toLowerCase().replace(/\s+/g, "-");
        idToMeta[id] = { category, name };
        orderedIds.push(id);
      });
    });

    const updateActive = () => {
      for (const id of orderedIds) {
        if (intersectingIds.current.has(id)) {
          const meta = idToMeta[id];
          setActiveComponent(meta.name);
          setOpenCategory(meta.category);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.current.add(entry.target.id);
          } else {
            intersectingIds.current.delete(entry.target.id);
          }
        });
        updateActive();
      },
      { rootMargin: "-10% 0px -60% 0px" }
    );

    orderedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const btnBase = "select-none w-fit text-left text-ds-body font-medium rounded-md px-3 py-2 active:scale-[0.96] transition-[color,background-color,scale] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hfine:hover:bg-[#eeeeee] active:bg-[#bbbbbb]";
  const btnStyle = { WebkitTapHighlightColor: "transparent" as const, touchAction: "manipulation" as const };

  return (
    <nav className="hidden lg:flex fixed bottom-6 left-6 z-50 flex-col gap-0.5 hero-fade hero-fade-4">
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
                          setOpenCategory(category);
                          const id = name.toLowerCase().replace(/\s+/g, "-");
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`${btnBase}${activeComponent === name ? " bg-black/[0.06]" : ""}`}
                        style={{
                          ...btnStyle,
                          color: activeComponent === name ? "#000000" : "#666666",
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(4px)",
                          transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), color 150ms cubic-bezier(0.23,1,0.32,1), background-color 150ms cubic-bezier(0.23,1,0.32,1), scale 150ms cubic-bezier(0.23,1,0.32,1)",
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

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose, scrollable = false }: { src: string; alt: string; onClose: () => void; scrollable?: boolean }) {
  const [visible, setVisible] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 160);
  }, [onClose]);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [close]);

  const dur = visible ? 220 : 160;
  const ease = "cubic-bezier(0.23,1,0.32,1)";

  return createPortal(
    <>
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          overflowY: scrollable ? "auto" : "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: scrollable ? "flex-start" : "center",
          padding: scrollable ? "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px)" : "clamp(16px, 4vw, 48px)",
          backgroundColor: visible ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)",
          backdropFilter: reduced ? undefined : (visible ? "blur(8px)" : "blur(0px)"),
          transition: `background-color ${dur}ms ${ease}${reduced ? "" : `, backdrop-filter ${dur}ms ${ease}`}`,
          cursor: "zoom-out",
        }}
      >
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          style={{
            ...(scrollable
              ? { width: "100%", maxWidth: "1100px" }
              : { maxWidth: "100%", maxHeight: "calc(100vh - 96px)" }),
            borderRadius: "6px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 25px 60px rgba(0,0,0,0.5)",
            opacity: visible ? 1 : 0,
            transform: (reduced || scrollable) ? undefined : (visible ? "scale(1)" : "scale(0.96)"),
            transition: `opacity ${dur}ms ${ease}${(reduced || scrollable) ? "" : `, transform ${dur}ms ${ease}`}`,
            willChange: "transform, opacity",
            cursor: "default",
          }}
        />
      </div>

      {/* Close button — fixed so it stays put while scrolling */}
      <button
        onClick={close}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 10000,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: visible ? 1 : 0,
          transition: `opacity ${dur}ms ${ease}`,
          color: "#ffffff",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </>,
    document.body
  );
}

// ─── ImagePlaceholder ─────────────────────────────────────────────────────────

function ImagePlaceholder({ aspect = "16/9" }: { aspect?: string }) {
  return (
    <div
      className="w-full rounded-[8px] bg-[#f2f2f2] border border-black/[0.06]"
      style={{ aspectRatio: aspect }}
    />
  );
}

// ─── CaseImage ────────────────────────────────────────────────────────────────

function CaseImage({ src, alt, label }: { src: string; alt: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="rounded-[8px] border border-black/[0.06] bg-[#f2f2f2] p-2 flex flex-col gap-2">
        {label && <span className="text-caption px-1">{label}</span>}
        <img
          src={src}
          alt={alt}
          onClick={() => setOpen(true)}
          className="w-full rounded-[6px] cursor-zoom-in"
        />
      </div>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── CaseImageStack ───────────────────────────────────────────────────────────

interface StackItem { src: string; alt: string; caption: string; scrollable?: boolean; }

function CaseImageStack({ label, images }: { label: string; images: StackItem[] }) {
  const [lightbox, setLightbox] = useState<StackItem | null>(null);
  return (
    <>
      <div className="rounded-[8px] border border-black/[0.06] bg-[#f2f2f2] p-2 flex flex-col gap-3">
        {label && <span className="text-caption px-1">{label}</span>}
        {images.map((img) => (
          <div key={img.src} className="flex flex-col gap-1.5">
            <span className="text-caption px-1">{img.caption}</span>
            <img
              src={img.src}
              alt={img.alt}
              onClick={() => setLightbox(img)}
              className="w-full rounded-[6px] cursor-zoom-in"
            />
          </div>
        ))}
      </div>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} scrollable={lightbox.scrollable} onClose={() => setLightbox(null)} />}
    </>
  );
}

// ─── PSSImages ────────────────────────────────────────────────────────────────

function PSSImages() {
  return (
    <div className="flex flex-col gap-3">
      <CaseImage src="/editage/pss/entry-point.avif" alt="Entry Point - In-Progress Jobs" label="Entry Point (In-Progress Jobs)" />
      <CaseImageStack
        label="Pack Management Page"
        images={[
          { src: "/editage/pss/pack-before.avif", alt: "Pack Management Page - Before", caption: "Before" },
          { src: "/editage/pss/pack-after.avif",  alt: "Pack Management Page - After",  caption: "After", scrollable: true },
        ]}
      />
      <CaseImageStack
        label=""
        images={[
          { src: "/editage/pss/reediting-tooltip.png", alt: "Re-editing Tooltip Hover State", caption: "Re-editing Tooltip Hover State" },
          { src: "/editage/pss/version-history.png",   alt: "Inline Version History",         caption: "Inline Version History" },
        ]}
      />
      <CaseImageStack
        label="Action Toasts"
        images={[
          { src: "/editage/pss/toast-approved.png", alt: "Post Approval Toast",       caption: "Post Approval Toast" },
          { src: "/editage/pss/toast-reedit.png",   alt: "Re-edit Approval Toast",    caption: "Re-edit Request Toast" },
        ]}
      />
      <CaseImageStack
        label="Pack Tag"
        images={[
          { src: "/editage/pss/pack-tag.avif",       alt: "Pack Tag",             caption: "Default" },
          { src: "/editage/pss/pack-tag-hover.avif", alt: "Pack Tag Hover State", caption: "Hover"   },
        ]}
      />
    </div>
  );
}

// ─── ProjectSection ───────────────────────────────────────────────────────────

interface ProjectSectionProps {
  name: string;
  tag?: string;
  context: string;
  problemStatement: string;
  impact: string;
  children?: React.ReactNode;
}

function ProjectSection({ name, tag, context, problemStatement, impact, children }: ProjectSectionProps) {
  const id = name.toLowerCase().replace(/\s+/g, "-");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elapsed = Date.now() - PAGE_LOAD_TIME;
          const wait = Math.max(0, HERO_DONE_MS - elapsed);
          timeout = setTimeout(() => setVisible(true), wait);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      className="flex flex-col gap-6 scroll-mt-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
        transition: visible
          ? "opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 300ms cubic-bezier(0.23,1,0.32,1), filter 300ms cubic-bezier(0.23,1,0.32,1)"
          : "none",
      }}
    >
      {/* Title row */}
      <div className="flex items-baseline gap-3">
        <p className="text-body" style={{ color: "#000000" }}>{name}</p>
        {tag && (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-caption"
            style={{ background: "#f2f2f2" }}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Text blocks */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-body" style={{ color: "#000000" }}>Context</p>
          <p className="text-body" style={{ color: "#666666" }}>{context}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body" style={{ color: "#000000" }}>Problem Statement</p>
          <p className="text-body" style={{ color: "#666666" }}>{problemStatement}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body" style={{ color: "#000000" }}>Impact</p>
          <p className="text-body" style={{ color: "#666666" }}>{impact}</p>
        </div>
      </div>

      {/* Image area */}
      {children ?? <ImagePlaceholder />}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditagePage() {
  return (
    <main className="flex flex-1 flex-col gap-30 bg-white overflow-x-clip">
      {/* Tree — fixed bottom-left, hidden on small screens */}
      <ComponentTree />

      {/* Hero */}
      <section className="w-full px-5 pt-30 pb-20">
          <div className="mx-auto flex max-w-content flex-col items-start gap-3 text-left">
            <h1
              className="text-display hero-fade hero-fade-1 self-start"
              style={{
                lineHeight: "0.9",
                paddingBottom: "0.15em",
                background:
                  "linear-gradient(to right, rgba(0,136,255,0.3) 0%, #0088ff 35%, #0088ff 75%, rgba(0,136,255,0.3) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Editage
            </h1>
            <p className="text-body hero-fade hero-fade-3">
              A collection of projects from my time at Editage. Beyond the work below, I worked within the Editage Design System to ensure consistency and scalability across products, and built localized landing pages for Germany, US, Spain, and Turkey, supporting the brand's expansion into newer markets.
            </p>
          </div>
        </section>

      {/* Project sections */}
      <section className="w-full px-5 pt-30 pb-20">
        <div className="mx-auto flex max-w-content flex-col gap-16">

          <ProjectSection
            name="PSS Pack Order Segregation"
            tag="ROW"
            context="PSS Packs bundle multiple services into a single, non-linear workflow, but the core experience was built ~7–8 years ago and largely untouched since, becoming fragmented over time. The task was to modernize the flow, align it with the design system, and scale it across devices without breaking user familiarity."
            problemStatement="The system's logic no longer matched user mental models — users couldn't track progress, understand service relationships, or know when action was needed. This drove high support dependency (~25–35% of users raising queries), delays in stage completion, and increased operational overhead."
            impact="Clearer hierarchy, contextual actions, and better state visibility will help users understand progress and act with confidence. Projected impact: ~25–35% drop in support emails, ~15–20% faster stage completion, and improved CSAT / NPS through reduced confusion."
          >
            <PSSImages />
          </ProjectSection>

          <ProjectSection
            name="CoPub Modal Integration"
            tag="ROW"
            context="The manuscript download screen was the final step after Premium Editing — users downloaded their files and exited. This was a peak-intent moment, right before journal submission. The project explored introducing Copub (submission support) here by intentionally interrupting the download and positioning it as the next step."
            problemStatement="While intent is high when the user reaches the download screen, interrupting a core action introduced risk — drop-offs, slower completion, and potential impact on trust (CSAT/NPS). The challenge was to test if this moment could be monetized without harming the experience."
            impact="This was a calculated bet on high-intent interception, introducing an add-on within a critical flow to drive conversions. Treated as an experiment, the goal was to observe user response, validate the approach, and iterate on the flow and strategy based on real behavior."
          >
            <div className="rounded-[8px] border border-black/[0.06] bg-[#f2f2f2] p-2">
              <iframe
                src="https://embed.figma.com/proto/jeB0tZhRuFZXoFGtFtuD9i/Personal-Projects?node-id=507-1699&viewport=-393%2C-6447%2C0.33&scaling=contain&content-scaling=fixed&starting-point-node-id=1266%3A19729&page-id=405%3A93&embed-host=share"
                allowFullScreen
                className="w-full rounded-[6px]"
                style={{ height: "450px", border: "none" }}
              />
            </div>
          </ProjectSection>

          <ProjectSection
            name="Insights Page Modal"
            tag="ROW"
            context="Editage Insights is a high-traffic content platform (~15M users) where researchers engage in long-form, high-intent reading journeys around writing and publication. Despite strong trust and deep engagement, the experience was designed purely for consumption, with no clear bridge to paid services."
            problemStatement="~85–90% of users exited after reading without entering any downstream funnel, leaving a massive volume of high-intent traffic unmonetized. Existing constraints made direct conversion risky — interruptive CTAs would reduce time-on-page, hurt credibility, and degrade the core reading experience."
            impact="Introduce a low-friction lead capture layer that converts a portion of engaged readers into qualified leads without impacting engagement metrics. Unlock a scalable acquisition channel by turning passive content consumption into measurable pipeline, while preserving trust and session depth."
          >
            <CaseImage src="/editage/insights-modal.avif" alt="Insights Page Modal" />
          </ProjectSection>

          <ProjectSection
            name="Landing Pages"
            tag="Spain"
            context="Editage was preparing to expand into Spain, but no dedicated website or landing experience existed for the market. The goal was to create the first localized landing page for Spanish users while staying aligned with the Editage Design System."
            problemStatement="Without a localized website, Spanish users had to rely on global pages that lacked relevant language, messaging, and trust signals. This created a major barrier to entry, with an estimated 30–40% higher bounce rate and 20–30% lower conversion compared to localized markets."
            impact="A dedicated Spanish landing page would make Editage feel more relevant, credible, and accessible to first-time users in the market, providing a stronger foundation for the brand's expansion into Spain."
          >
            <div className="rounded-[8px] border border-black/[0.06] bg-[#f2f2f2] p-2">
              <iframe
                src="https://embed.figma.com/proto/jeB0tZhRuFZXoFGtFtuD9i/My-Projects?node-id=1219-23136&viewport=-5635%2C-6624%2C0.33&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=1219%3A23136&page-id=405%3A93&embed-host=share"
                allowFullScreen
                className="w-full rounded-[6px]"
                style={{ height: "450px", border: "none" }}
              />
            </div>
          </ProjectSection>

        </div>
      </section>

      <section className="w-full px-5 pt-30 pb-20">
        <div className="mx-auto flex max-w-content flex-row flex-wrap items-center justify-center gap-3">
          <Link href="/"><SiteSecondaryButton className="!h-[66px] !px-6 !text-[24px]">Home</SiteSecondaryButton></Link>
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SiteSecondaryButton className="!h-[66px] !px-6 !text-[24px]">LinkedIn</SiteSecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SiteSecondaryButton className="!h-[66px] !px-6 !text-[24px]">X</SiteSecondaryButton></a>
          <a href="https://cal.com/vedant-lad-uv3rmx/15min" target="_blank" rel="noopener noreferrer"><SiteSecondaryButton className="!h-[66px] !px-6 !text-[24px]">Get in touch</SiteSecondaryButton></a>
        </div>
      </section>
    </main>
  );
}
