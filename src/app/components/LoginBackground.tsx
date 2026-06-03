"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase, isSupabaseConfigured, ENTRIES_TABLE } from "@/lib/supabase";
import { Floating, FloatingElement } from "./ParallaxFloating";

// Scatter positions around the edges (numeric %), leaving the center clearer.
const SLOTS = [
  { top: 8, left: 6, size: 150, depth: 0.8 },
  { top: 16, left: 26, size: 96, depth: 1.5 },
  { top: 10, left: 68, size: 128, depth: 1 },
  { top: 6, left: 86, size: 104, depth: 0.6 },
  { top: 40, left: 3, size: 116, depth: 1.2 },
  { top: 52, left: 89, size: 138, depth: 0.9 },
  { top: 74, left: 9, size: 124, depth: 1 },
  { top: 82, left: 30, size: 92, depth: 1.6 },
  { top: 80, left: 66, size: 112, depth: 1.1 },
  { top: 70, left: 87, size: 100, depth: 0.7 },
  { top: 30, left: 80, size: 84, depth: 1.7 },
  { top: 24, left: 48, size: 72, depth: 1.9 },
];

export default function LoginBackground({
  launching = false,
}: {
  launching?: boolean;
}) {
  const reduce = useReducedMotion();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from(ENTRIES_TABLE)
        .select("image_url")
        .order("created_at", { ascending: false })
        .limit(SLOTS.length);
      if (!active || !data) return;
      setImages(data.map((d) => d.image_url as string));
    })();
    return () => {
      active = false;
    };
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Floating>
        {SLOTS.map((slot, i) => {
          const src = images[i % images.length];

          // Direction from center → used to fling the image outward on launch,
          // mimicking a perspective fly-past (center images zoom ~straight).
          const dx = slot.left - 50;
          const dy = slot.top - 50;
          const mag = Math.hypot(dx, dy) || 1;
          const outX = (dx / mag) * 700;
          const outY = (dy / mag) * 700;

          const launchAnim = reduce
            ? { opacity: 0 }
            : { x: outX, y: outY, scale: 5, opacity: 0 };
          const idleAnim = reduce
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, x: 0, y: 0 };

          return (
            <FloatingElement
              key={i}
              depth={slot.depth}
              style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
            >
              <motion.img
                src={src}
                alt=""
                draggable={false}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={launching ? launchAnim : idleAnim}
                transition={
                  launching
                    ? { duration: 0.8, ease: [0.4, 0, 1, 1], delay: i * 0.03 }
                    : { delay: i * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }
                }
                style={{
                  width: slot.size,
                  height: slot.size,
                  // Justified only for the one heavy frame — the launch warp.
                  willChange: launching ? "transform, opacity" : undefined,
                }}
                className="rounded-2xl border border-black/10 object-cover shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              />
            </FloatingElement>
          );
        })}
      </Floating>

      {/* Center vignette so the login form stays legible over the images. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: launching ? 0 : 1,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 32%, rgba(255,255,255,0.35) 100%)",
        }}
      />
    </div>
  );
}
