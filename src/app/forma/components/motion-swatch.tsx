"use client";

import { useState } from "react";

export function MotionSwatch({ duration, easing }: { duration: string; easing: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-[200px] h-6 bg-ds-neutral-100 dark:bg-ds-neutral-800 rounded-full overflow-hidden cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 bg-[#0088ff] rounded-full"
        style={{
          transformOrigin: "left center",
          transform: hovered ? "scaleX(1)" : "scaleX(0.04)",
          transition: `transform ${duration} ${easing}`,
        }}
      />
    </div>
  );
}
