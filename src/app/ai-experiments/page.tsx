"use client";

import { useState } from "react";
import Link from "next/link";
import SecondaryButton from "../components/SecondaryButton";
import { CreatorHoverCard } from "./components/creator-hover-card";
import { EmailCaptureMorph } from "./components/email-capture-morph";

function ExperimentSection({ label, footnote, children }: {
  label: string;
  footnote?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-body" style={{ color: "#000000" }}>{label}</p>
        {footnote && <p className="text-body" style={{ color: "#999999" }}>{footnote}</p>}
      </div>
      <div className="rounded-2xl border border-black/[0.08] overflow-visible flex items-center justify-center px-6 py-14">
        {children}
      </div>
    </div>
  );
}

export default function AIExperimentsPage() {
  const [shimmer, setShimmer] = useState(false);

  return (
    <main className="flex flex-1 flex-col bg-white overflow-x-clip">
      {/* Back link — fixed top-left */}
      <div className="fixed top-5 left-5 z-50 hero-fade hero-fade-2">
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

      <div className="mx-auto w-full max-w-[700px] px-4 sm:px-0">
        {/* Hero */}
        <section className="pt-[80px] pb-[24px] sm:py-[60px] flex flex-col gap-3">
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
            AI Experiments
          </h1>
          <p className="text-body hero-fade hero-fade-3" style={{ maxWidth: "520px" }}>
            A collection of experiments exploring what's possible at the intersection of AI and design.
          </p>
        </section>

        {/* Experiments */}
        <section className="flex flex-col gap-12 pb-[80px] sm:pb-[120px]">
          <ExperimentSection
            label="Creator Hover Card"
            footnote="Recreated from @hours on X"
          >
            <p className="text-body font-medium text-[#666]">
              Made with love by{" "}
              <CreatorHoverCard
                name="Vedant"
                handle="@vedantdzn"
                avatarSrc="/avatar.jpg"
                bio="Product designer"
                following={124}
                followers={150}
                verified
              >
                Vedant
              </CreatorHoverCard>
            </p>
          </ExperimentSection>

          <ExperimentSection
            label="Fun Waitlist"
            footnote="Recreated from @hours on X"
          >
            <div className="flex flex-col items-center gap-5">
              <h2
                className={shimmer ? "headline headline-shimmer" : "headline"}
                onAnimationEnd={() => setShimmer(false)}
                style={{
                  margin: 0,
                  fontSize: "30px",
                  lineHeight: "32px",
                  fontWeight: 500,
                  letterSpacing: "-0.6px",
                  textAlign: "center",
                }}
              >
                Your next trade awaits
              </h2>
              <EmailCaptureMorph onSuccess={() => setShimmer(true)} />
            </div>
          </ExperimentSection>
        </section>
      </div>

      <div className="w-full px-4 py-[60px] sm:px-0 sm:py-[120px]">
        <div className="mx-auto flex max-w-[700px] flex-row flex-wrap items-center justify-center gap-3">
          <Link href="/"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">Home</SecondaryButton></Link>
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">LinkedIn</SecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">X</SecondaryButton></a>
        </div>
      </div>
    </main>
  );
}
