"use client";

import { sounds } from "@/lib/sounds";

export default function Hero() {
  return (
    <section className="w-full px-5 pt-10 pb-10 sm:pt-30 sm:pb-15">
      <div className="mx-auto flex max-w-content flex-col items-center gap-3 text-center">
        <h1 className="sr-only">Prysm</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/prysm-logo.webp"
          alt="Prysm"
          onMouseDown={sounds.buttonSecondary}
          className="hero-fade hero-fade-1 w-[260px] max-w-[80vw] cursor-pointer select-none transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] sm:w-[420px]"
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
          draggable={false}
        />
        <p className="text-ds-body text-ds-neutral-600 hero-fade hero-fade-3 max-w-[450px] [text-wrap:pretty]">
          A growing collection of images and the exact prompts used to make them.
        </p>
      </div>
    </section>
  );
}
