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
    <main className="flex flex-1 flex-col gap-30 bg-white overflow-x-clip">
      {/* Hero */}
      <section className="w-full px-5 pt-30 pb-20">
          <div className="mx-auto flex max-w-content flex-col items-start gap-3 text-left">
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
            <p className="text-body hero-fade hero-fade-3">
              A collection of experiments exploring what's possible at the intersection of AI and design.
            </p>
          </div>
        </section>

      {/* Experiments */}
      <section className="w-full px-5 pt-30 pb-20">
        <div className="mx-auto flex max-w-content flex-col gap-12">
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
        </div>
      </section>

      <section className="w-full px-5 pt-30 pb-20">
        <div className="mx-auto flex max-w-content flex-row flex-wrap items-center justify-center gap-3">
          <Link href="/"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">Home</SecondaryButton></Link>
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">LinkedIn</SecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">X</SecondaryButton></a>
          <a href="https://cal.com/vedant-lad-uv3rmx/15min" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">Get in touch</SecondaryButton></a>
        </div>
      </section>
    </main>
  );
}
