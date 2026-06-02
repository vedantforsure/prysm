"use client";

import { sounds } from "@/lib/sounds";

export default function Hero() {
  return (
    <section className="w-full px-5 pt-30 pb-20">
      <div className="mx-auto flex max-w-content flex-col items-start text-left">
        <p className="[text-wrap:pretty]">
          <span
            onMouseDown={sounds.buttonSecondary}
            className="text-display hero-fade hero-fade-1 cursor-pointer select-none transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            style={{
              display: "inline-block",
              lineHeight: "0.85",
              background:
                "linear-gradient(to right, rgba(0,136,255,0.3) 0%, #0088ff 35%, #0088ff 75%, rgba(0,136,255,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            Vedant
          </span>{" "}
          <span className="text-body hero-fade hero-fade-3">
            is a product designer crafting software at the intersection of design and code, driven by taste and an obsession with form and function.
          </span>
        </p>
      </div>
    </section>
  );
}
