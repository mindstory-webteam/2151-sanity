"use client";

import { useEffect, useRef, CSSProperties } from "react";
import type { ElementType } from "react";
import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
type FromTo = {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotation?: number;
  skewX?: number;
  [key: string]: number | undefined;
};

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: FromTo;
  to?: FromTo;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  tag?: ElementType;
  /**
   * Deprecated — the hover-roll animation has been removed (it was
   * rendering duplicate DOM text nodes, causing doubled text like
   * "TTHHEEMMOOLLDD??" in the raw HTML). These props are kept ONLY so
   * existing call sites (e.g. Aboutsection.tsx) don't fail to compile.
   * They are accepted but intentionally unused.
   */
  hoverRoll?: boolean;
  hoverRollDirection?: "left" | "right" | "center";
  autoRoll?: boolean;
  autoRollInterval?: number;
  autoRollDuration?: number;
}

/* ═══════════════════════════════════════════════════════════
   SplitText — FIXED

   REMOVED: hoverRoll / TextRoll / TextRollChar. That code path
   rendered every character as TWO real DOM text nodes (a visible
   row + an aria-hidden "ghost" row for the roll animation). Since
   this is a "use client" component, Next.js still server-renders
   it before hydration, so both text nodes existed in the raw
   HTML — producing doubled text like "TTHHEEMMOOLLDD??" for any
   crawler, bot, or tool reading the HTML directly. Matches the
   fix already applied to the navbar's SplitText component.

   FIXED: the scroll-reveal entrance animation (this component's
   main purpose) now always renders the plain, real `text` as an
   actual child on first render — server and client — so there's
   no gap where the heading is empty before JS runs. The GSAP
   fade/slide-in animation still runs the same as before; it now
   just operates on word or char spans that each contain a single
   real copy of their text, never a duplicate.
═══════════════════════════════════════════════════════════ */
export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
  showCallback = false,
  tag: Tag = "div",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverRoll,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverRollDirection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoRoll,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoRollInterval,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoRollDuration,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Container already has the real `text` rendered (see JSX below).
    // We now progressively enhance it into per-word/char/line spans
    // for the entrance animation — same approach as before, but
    // starting from real server-rendered text instead of empty.
    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";

      if (splitType === "chars") {
        const spans: HTMLElement[] = [];
        text.split(" ").forEach((word, wi, arr) => {
          const wordEl = document.createElement("span");
          wordEl.style.display    = "inline-block";
          wordEl.style.whiteSpace = "nowrap";

          word.split("").forEach((char) => {
            const el = document.createElement("span");
            el.textContent      = char; // single real text node per char
            el.style.display    = "inline-block";
            el.style.willChange = "transform, opacity";
            wordEl.appendChild(el);
            spans.push(el);
          });

          container.appendChild(wordEl);

          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML     = "&nbsp;";
            sp.style.display = "inline-block";
            container.appendChild(sp);
          }
        });
        return spans;
      }

      if (splitType === "words") {
        return text.split(" ").map((word, wi, arr) => {
          const el = document.createElement("span");
          el.textContent      = word + (wi < arr.length - 1 ? "\u00A0" : "");
          el.style.display    = "inline-block";
          el.style.willChange = "transform, opacity";
          container.appendChild(el);
          return el;
        });
      }

      return text.split("\n").map((line) => {
        const el = document.createElement("span");
        el.textContent      = line;
        el.style.display    = "block";
        el.style.willChange = "transform, opacity";
        container.appendChild(el);
        return el;
      });
    };

    const targets = buildSpans();
    if (!targets.length) return;

    gsap.set(targets, { ...from });

    tlRef.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete();
      },
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          tlRef.current?.play();
          io.unobserve(container);
        }
      }),
      { threshold, rootMargin }
    );
    io.observe(container);

    return () => {
      io.disconnect();
      tlRef.current?.kill();
      if (container) container.textContent = text; // restore plain text on cleanup
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      className={className}
      style={{ textAlign, lineHeight: "inherit" }}
      aria-label={text}
    >
      {text /* real text on first (server) render — no empty-until-JS gap */}
    </Tag>
  );
}