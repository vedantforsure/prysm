"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function Navbar() {
  const pathname = usePathname();
  const isAIExperiments = pathname === "/ai-experiments";
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-4 left-5 right-5 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-nav flex items-center justify-between pointer-events-auto">
        {isHome ? (
          <div />
        ) : (
          <Link
            href="/"
            className="text-display flex h-10 items-center"
            style={{
              fontSize: "40px",
              lineHeight: "44px",
              letterSpacing: "-1.2px",
              background:
                "linear-gradient(to right, rgba(0,136,255,0.3) 0%, #0088ff 35%, #0088ff 75%, rgba(0,136,255,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Vedant
          </Link>
        )}
        <div className="flex items-center">
        <div className="hidden sm:flex items-center gap-1">
          {isAIExperiments
            ? <Link href="/"><SecondaryButton>Home</SecondaryButton></Link>
            : <Link href="/ai-experiments"><SecondaryButton>AI experiments</SecondaryButton></Link>
          }
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SecondaryButton>LinkedIn</SecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SecondaryButton>X</SecondaryButton></a>
        </div>
        <div className="sm:ml-3">
          <a href="https://cal.com/vedant-lad-uv3rmx/15min" target="_blank" rel="noopener noreferrer">
            <PrimaryButton>Get in touch</PrimaryButton>
          </a>
        </div>
        </div>
      </div>
    </nav>
  );
}
