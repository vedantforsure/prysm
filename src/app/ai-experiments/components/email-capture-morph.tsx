"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

const EASE_SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const H = 52;
const CD = 46;
const PAD = 3;
const IDLE_W = 164;
const INPUT_PL = 18;
const INPUT_PR = CD + PAD * 2 + 8;

const FITTED_ICON   = 16;
const FITTED_GAP    = 8;
const FITTED_PAD_X  = 24;
const FITTED_MIN_W  = 140;

const PILL_SPRING   = { type: "spring" as const, stiffness: 500, damping: 22, mass: 0.8 };
const EXPAND_SPRING = { type: "spring" as const, stiffness: 360, damping: 26, mass: 1.1 };
const PILL_MS = 440;

type Phase = "idle" | "active" | "success";

function getContainerWidth(phase: Phase, fittedW: number, textW: number): number {
  if (phase === "idle") return IDLE_W;
  if (phase === "success") return fittedW;
  const emailDriven = INPUT_PL + textW + INPUT_PR + 6;
  return Math.max(fittedW, emailDriven);
}

export function EmailCaptureMorph({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [registeredW, setRegisteredW] = useState(0);
  const [textW, setTextW] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const registeredMirrorRef = useRef<HTMLSpanElement>(null);
  const emailMirrorRef = useRef<HTMLSpanElement>(null);
  const placeholderMirrorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    setRegisteredW(registeredMirrorRef.current?.offsetWidth ?? 0);
  }, []);

  useLayoutEffect(() => {
    const emailW = emailMirrorRef.current?.offsetWidth ?? 0;
    const phW    = placeholderMirrorRef.current?.offsetWidth ?? 0;
    setTextW(Math.max(emailW, phW));
  }, [email, phase]);

  const isIdle    = phase === "idle";
  const isActive  = phase === "active";
  const isSuccess = phase === "success";

  const fittedW = Math.max(FITTED_MIN_W, registeredW + FITTED_ICON + FITTED_GAP + FITTED_PAD_X * 2);
  const cw = getContainerWidth(phase, fittedW, textW);

  const pillFull   = !isActive;
  const pillRight  = pillFull ? 0  : PAD;
  const pillTop    = pillFull ? 0  : PAD;
  const pillBottom = pillFull ? 0  : PAD;
  const pillWidth  = pillFull ? cw : CD;

  const activeSpring = isSuccess ? EXPAND_SPRING : PILL_SPRING;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) { setPhase("success"); onSuccess?.(); } }}
      style={{ display: "inline-block" }}
    >
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={false}
        animate={{ width: cw }}
        transition={{ width: activeSpring }}
        style={{
          position: "relative",
          maxWidth: "calc(100vw - 32px)",
          height: H,
          borderRadius: H,
          backgroundColor: "#f2f2f2",
          border: `1px solid ${focused ? "rgba(0,153,255,0.28)" : isActive ? "rgba(0,0,0,0.1)" : "transparent"}`,
          boxShadow: focused ? "0 0 0 3px rgba(0,153,255,0.09)" : "none",
          overflow: "hidden",
          cursor: isIdle ? "pointer" : "default",
          transition: "border-color 240ms ease, box-shadow 220ms ease",
          willChange: "width",
          userSelect: "none",
        }}
      >
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setPhase("idle"); setEmail(""); setFocused(false); inputRef.current?.blur();
            }
          }}
          placeholder="you@email.com"
          tabIndex={isActive ? 0 : -1}
          autoComplete="email"
          style={{
            position: "absolute",
            inset: 0,
            paddingLeft: INPUT_PL,
            paddingRight: INPUT_PR,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#171717",
            letterSpacing: "0.01em",
            opacity: isActive ? 1 : 0,
            transition: `opacity 200ms ease ${isActive ? "260ms" : "0ms"}`,
            pointerEvents: isActive ? "auto" : "none",
          }}
        />

        <motion.button
          type={isActive ? "submit" : "button"}
          disabled={isSuccess}
          onClick={isIdle ? () => { setPhase("active"); setTimeout(() => inputRef.current?.focus(), 40); } : undefined}
          initial={false}
          animate={{ right: pillRight, top: pillTop, bottom: pillBottom, width: pillWidth }}
          transition={activeSpring}
          style={{
            position: "absolute",
            borderRadius: H,
            backgroundColor: "#0099FF",
            border: "none",
            padding: 0,
            zIndex: 2,
            cursor: isIdle || isActive ? "pointer" : "default",
            overflow: "hidden",
            willChange: "right, width",
          }}
        >
          <div style={{
            position: "absolute", left: 16, top: "50%", width: 20, height: 20, marginTop: -10,
            opacity: isIdle ? 1 : 0,
            transform: hovered && isIdle ? "rotate(90deg)" : "rotate(0deg)",
            transition: `opacity 140ms ease, transform 420ms ${EASE_SPRING}`,
            pointerEvents: "none",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.999 17.999H2V2H17.999V17.999ZM10 3.59961C6.46545 3.59961 3.59961 6.46545 3.59961 10C3.59986 13.5343 6.4656 16.3994 10 16.3994C13.5342 16.3992 16.3992 13.5342 16.3994 10C16.3994 6.4656 13.5343 3.59985 10 3.59961Z" fill="white"/>
            </svg>
          </div>

          <span style={{
            position: "absolute", left: 44, top: "50%", transform: "translateY(-50%)",
            fontSize: 14, fontWeight: 500, color: "#ffffff", letterSpacing: "0.01em",
            whiteSpace: "nowrap", opacity: isIdle ? 1 : 0, transition: "opacity 120ms ease",
            pointerEvents: "none",
          }}>
            Request access
          </span>

          <div style={{
            position: "absolute", left: "50%", top: "50%", width: 20, height: 20, marginLeft: -10, marginTop: -10,
            opacity: isActive ? 1 : 0,
            transition: `opacity 180ms ease ${isActive ? `${PILL_MS - 180}ms` : "0ms"}`,
            pointerEvents: "none",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10H17M11.2727 15L17 10L11.2727 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: isSuccess ? 1 : 0,
            transition: `opacity 180ms ease ${isSuccess ? `${PILL_MS - 180}ms` : "0ms"}`,
            pointerEvents: "none",
          }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7L5.5 10.5L12 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
              Registered
            </span>
          </div>
        </motion.button>
      </motion.div>

      <span ref={registeredMirrorRef} aria-hidden style={MIRROR_STYLE}>Registered</span>
      <span ref={emailMirrorRef} aria-hidden style={MIRROR_STYLE}>{email}</span>
      <span ref={placeholderMirrorRef} aria-hidden style={MIRROR_STYLE}>you@email.com</span>
    </form>
  );
}

const MIRROR_STYLE: React.CSSProperties = {
  position: "fixed", top: -9999, left: -9999, visibility: "hidden",
  pointerEvents: "none", fontSize: 14, fontWeight: 500, letterSpacing: "0.01em", whiteSpace: "nowrap",
};
