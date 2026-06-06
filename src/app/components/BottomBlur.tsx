/**
 * White progressive ("stacked") blur fade at the bottom of the page, behind
 * the floating CTA. Each layer applies a larger backdrop blur revealed through
 * a narrow mask band, so the blur ramps smoothly from soft (top) to strong
 * (bottom) instead of one uniform blur. A white tint fades the content out.
 */
const LAYERS = 6;
const HEIGHT = 150;
const BASE_BLUR = 0.5; // px, doubles each layer
const clamp = (v: number) => Math.max(0, Math.min(100, v));

export default function BottomBlur() {
  const step = 100 / LAYERS;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: HEIGHT,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: LAYERS }).map((_, i) => {
        const blur = BASE_BLUR * Math.pow(2, i);
        const p0 = clamp((i - 1) * step);
        const p1 = clamp(i * step);
        const p2 = clamp((i + 1) * step);
        const p3 = clamp((i + 2) * step);
        const mask = `linear-gradient(to bottom, transparent ${p0}%, black ${p1}%, black ${p2}%, transparent ${p3}%)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      {/* Page-color tint that fades up, dissolving content into the page. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 75%)",
        }}
      />
    </div>
  );
}
