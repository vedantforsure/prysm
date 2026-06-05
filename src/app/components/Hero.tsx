"use client";

import { sounds } from "@/lib/sounds";

export default function Hero() {
  return (
    <section className="w-full px-5 pt-10 pb-10 sm:pt-30 sm:pb-20">
      <div className="mx-auto flex max-w-content flex-col items-center gap-3 text-center">
        <h1
          onMouseDown={sounds.buttonSecondary}
          className="text-display hero-fade hero-fade-1 cursor-pointer select-none transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
          style={{
            display: "inline-block",
            lineHeight: "1",
            paddingRight: "0.08em",
            paddingBottom: "0.12em",
            background:
              "linear-gradient(to right, rgba(255,77,166,0.3) 0%, #ff4da6 35%, #ff4da6 75%, rgba(255,77,166,0.3) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          Prysm
        </h1>
        <p className="text-ds-body text-ds-neutral-600 hero-fade hero-fade-3 max-w-[450px] [text-wrap:pretty]">
          A growing collection of images and the exact prompts used to make them.
        </p>
      </div>
    </section>
  );
}
