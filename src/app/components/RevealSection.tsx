"use client";

import { useEffect, useRef, useState } from "react";

const HERO_DONE_MS = 550;

let pageLoadTime: number | null = null;

function getPageLoadTime() {
  if (pageLoadTime === null) pageLoadTime = Date.now();
  return pageLoadTime;
}

export default function RevealSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset load time on each page mount
    pageLoadTime = Date.now();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elapsed = Date.now() - getPageLoadTime();
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
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
        transition: visible
          ? "opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 300ms cubic-bezier(0.23,1,0.32,1), filter 300ms cubic-bezier(0.23,1,0.32,1)"
          : "none",
      }}
    >
      {children}
    </div>
  );
}
