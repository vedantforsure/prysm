"use client";

import { useRouter } from "next/navigation";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import RevealSection from "./components/RevealSection";
import SecondaryButton from "./components/SecondaryButton";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-1 flex-col gap-30 bg-white">
      <Hero />
      <RevealSection className="w-full px-5 pt-30 pb-20">
        <div className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ProjectCard
            name="Forma"
            description="A minimal, opinionated design system for React apps."
            onClick={() => router.push("/forma")}
            background={
              <>
                <img src="/card-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 100%", outline: "1px solid rgba(255,255,255,0.06)" }} />
                <img src="/scout.svg" alt="" className="absolute inset-0 m-auto w-16 h-16 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </>
            }
          />
          <ProjectCard
            name="Editage"
            description="A collection of projects i worked on during my time at Editage."
            onClick={() => router.push("/editage")}
            background={
              <>
                <img src="/card-bg-2.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 100%", outline: "1px solid rgba(255,255,255,0.06)" }} />
                <img src="/vector.svg" alt="" className="absolute inset-0 m-auto w-40 h-16 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </>
            }
          />
          <ProjectCard
            name="Reva Dashboard"
            description="An AI powered dashboard to manage your online thrift store."
            background={
              <>
                <img
                  src="/card-bg-3.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "50% 100%", outline: "1px solid rgba(255,255,255,0.06)" }}
                />
                <img src="/t.svg" alt="" className="absolute inset-0 m-auto w-16 h-16 object-contain pointer-events-none" style={{ filter: "brightness(0) invert(1)" }} />
              </>
            }
          />
          <ProjectCard
            name="AI Experiments"
            description="Playful prototypes exploring what happens at the intersection of AI and design."
            onClick={() => router.push("/ai-experiments")}
            background={
              <>
                <img src="/card-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 100%", outline: "1px solid rgba(255,255,255,0.06)" }} />
                <img src="/globe.svg" alt="" className="absolute inset-0 m-auto w-16 h-16 object-contain pointer-events-none" style={{ filter: "brightness(0) invert(1)" }} />
              </>
            }
          />
          </div>
        </div>
      </RevealSection>
      <RevealSection className="w-full px-5 pt-30 pb-20">
        <div className="mx-auto flex max-w-content flex-row flex-wrap items-center justify-center gap-3">
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">LinkedIn</SecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">X</SecondaryButton></a>
          <a href="https://cal.com/vedant-lad-uv3rmx/15min" target="_blank" rel="noopener noreferrer"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">Get in touch</SecondaryButton></a>
        </div>
      </RevealSection>
    </main>
  );
}
