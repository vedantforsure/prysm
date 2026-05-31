"use client";

import { useRouter } from "next/navigation";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import SecondaryButton from "./components/SecondaryButton";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-1 flex-col bg-white">
      <Hero />
      <section className="w-full px-4 py-[24px] sm:px-0 sm:py-[60px]">
        <div className="mx-auto max-w-[700px] flex flex-col gap-5">
          <span
            className="text-display sm:![font-size:44px] self-start"
            style={{
              fontSize: "32px",
              lineHeight: "36px",
              letterSpacing: "-1.5px",
              background: "linear-gradient(to right, rgba(153,153,153,0.3) 0%, #999999 35%, #999999 75%, rgba(153,153,153,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Work
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ProjectCard
            name="Forma"
            description="A minimal, opinionated design system for React apps."
            onClick={() => router.push("/forma")}
            background={
              <>
                <img src="/card-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ outline: "1px solid rgba(255,255,255,0.06)" }} />
                <img src="/scout.svg" alt="" className="absolute inset-0 m-auto w-16 h-16 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </>
            }
          />
          <ProjectCard
            name="Editage"
            description="A collection of projects i worked on during my time at Editage."
            background={
              <>
                <img src="/card-bg-2.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ outline: "1px solid rgba(255,255,255,0.06)" }} />
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
          </div>
        </div>
      </section>
      <section className="w-full px-4 py-[60px] sm:px-0 sm:py-[120px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <SecondaryButton className="!h-[66px] !px-6 !text-[24px] w-full sm:w-auto">AI experiments</SecondaryButton>
          <SecondaryButton className="!h-[66px] !px-6 !text-[24px] w-full sm:w-auto">LinkedIn</SecondaryButton>
          <SecondaryButton className="!h-[66px] !px-6 !text-[24px] w-full sm:w-auto">X</SecondaryButton>
        </div>
      </section>
    </main>
  );
}
