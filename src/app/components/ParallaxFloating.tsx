"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Parallax floating effect (à la fancycomponents.dev/@fancy/parallax-floating).
 *
 * <Floating> tracks the pointer and runs a single rAF loop that writes
 * `translate3d(...)` straight to each registered element — GPU-composited, no
 * React re-renders and no per-element springs. Each <FloatingElement> shifts by
 * the pointer offset scaled by its `depth`.
 */
type Registry = {
  register: (el: HTMLElement, depth: number) => () => void;
};
const RegistryContext = createContext<Registry | null>(null);

const TRAVEL = 60; // px of movement at depth 1
const SMOOTHING = 0.08; // lerp factor toward the pointer (spring-like)

export function Floating({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const items = useRef(new Map<HTMLElement, number>());

  const register = useCallback((el: HTMLElement, depth: number) => {
    items.current.set(el, depth);
    return () => {
      items.current.delete(el);
    };
  }, []);
  const registry = useMemo<Registry>(() => ({ register }), [register]);

  useEffect(() => {
    if (reduce) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf: number | null = null;

    const tick = () => {
      current.x += (target.x - current.x) * SMOOTHING;
      current.y += (target.y - current.y) * SMOOTHING;
      for (const [el, depth] of items.current) {
        el.style.transform = `translate3d(${current.x * depth * TRAVEL}px, ${current.y * depth * TRAVEL}px, 0)`;
      }
      const settled =
        Math.abs(target.x - current.x) < 0.001 &&
        Math.abs(target.y - current.y) < 0.001;
      raf = settled ? null : requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf == null) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <RegistryContext.Provider value={registry}>
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        {children}
      </div>
    </RegistryContext.Provider>
  );
}

export function FloatingElement({
  children,
  depth = 1,
  className,
  style,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const registry = useContext(RegistryContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !registry) return;
    return registry.register(el, depth);
  }, [registry, depth]);

  return (
    <div
      ref={ref}
      className={cn("absolute", className)}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
