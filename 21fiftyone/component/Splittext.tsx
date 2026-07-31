"use client";

import { useEffect, useRef, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion, useAnimation } from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimation>;
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
  hoverRoll?: boolean;
  hoverRollDirection?: "left" | "right" | "center";
  /* ── auto-roll props ── */
  autoRoll?: boolean;           // enable timed auto-roll
  autoRollInterval?: number;    // ms between rolls (default 2500)
  autoRollDuration?: number;    // ms for the roll animation (default 400)
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.035;

function getDelay(i: number, total: number, direction: "left" | "right" | "center") {
  if (direction === "center") return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
  if (direction === "right")  return ROLL_STAGGER * (total - 1 - i);
  return ROLL_STAGGER * i;
}

/* ═══════════════════════════════════════════════════════════
   TEXT ROLL CHAR — individual character with auto + hover roll
═══════════════════════════════════════════════════════════ */
interface TextRollCharProps {
  char: string;
  delay: number;
  duration: number;
  controls: AnimationControls;
}

const TextRollChar: React.FC<TextRollCharProps> = ({ char, delay, duration, controls }) => {
  const easing = "easeInOut";
  const ch = char === " " ? "\u00A0" : char;

  return (
    <span style={{ display: "inline-block", position: "relative", overflow: "hidden", lineHeight: 0.88, verticalAlign: "top" }}>
      {/* visible row */}
      <motion.span
        style={{ display: "block" }}
        animate={controls}
        variants={{
          idle:    { y: "0%",    transition: { ease: easing, duration: duration / 1000, delay } },
          rolling: { y: "-100%", transition: { ease: easing, duration: duration / 1000, delay } },
          reset:   { y: "100%",  transition: { duration: 0 } },
        }}
      >
        {ch}
      </motion.span>
      {/* hidden row slides up from below */}
      <motion.span
        aria-hidden="true"
        style={{ display: "block", position: "absolute", inset: 0, whiteSpace: "pre" }}
        animate={controls}
        variants={{
          idle:    { y: "100%",  transition: { ease: easing, duration: duration / 1000, delay } },
          rolling: { y: "0%",    transition: { ease: easing, duration: duration / 1000, delay } },
          reset:   { y: "200%",  transition: { duration: 0 } },
        }}
      >
        {ch}
      </motion.span>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   TEXT ROLL UNIT — wraps a word/char unit, owns the controls
   and manages both auto-roll timer and hover trigger.
═══════════════════════════════════════════════════════════ */
interface TextRollUnitProps {
  children: string;
  direction?: "left" | "right" | "center";
  autoRoll?: boolean;
  autoRollInterval?: number;
  autoRollDuration?: number;
}

export const TextRoll: React.FC<TextRollUnitProps> = ({
  children,
  direction = "left",
  autoRoll = false,
  autoRollInterval = 2500,
  autoRollDuration = 400,
}) => {
  const chars    = children.split("");
  const total    = chars.length;
  const controls = useAnimation();
  const hovering = useRef(false);
  const rolling  = useRef(false);
  const mounted  = useRef(false); // ← FIX: track mount state

  // ← FIX: set mounted true after component mounts, false on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const doRoll = async () => {
    // ← FIX: guard — do nothing if not mounted yet or already rolling
    if (!mounted.current || rolling.current) return;
    rolling.current = true;

    await controls.start("rolling");

    // ← FIX: guard after each await in case component unmounted mid-animation
    if (!mounted.current) {
      rolling.current = false;
      return;
    }

    // instant reset to below
    await controls.start("reset");

    if (!mounted.current) {
      rolling.current = false;
      return;
    }

    await controls.start("idle");
    rolling.current = false;
  };

  /* auto-roll timer */
  useEffect(() => {
    if (!autoRoll) return;
    const id = setInterval(() => {
      if (!hovering.current) doRoll();
    }, autoRollInterval);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRoll, autoRollInterval]);

  const handleMouseEnter = () => {
    hovering.current = true;
    doRoll();
  };
  const handleMouseLeave = () => {
    hovering.current = false;
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-flex",
        cursor: "pointer",
        userSelect: "none",
        verticalAlign: "top",
      }}
    >
      {chars.map((ch, i) => (
        <TextRollChar
          key={i}
          char={ch}
          controls={controls}
          delay={getDelay(i, total, direction)}
          duration={autoRollDuration}
        />
      ))}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   HOVER ROLL SPLIT TEXT
   Scroll-reveals each unit with GSAP, each unit has TextRoll.

   SEO FIX: the container carries the single, clean, real text
   via aria-label + role="text". Every animated unit wrapper
   below it is marked aria-hidden="true" so crawlers/screen
   readers only ever see ONE copy of the text — the doubled-
   letter animation markup (e.g. "HHOOMMEE") is treated as
   purely decorative and excluded from the accessible tree.
═══════════════════════════════════════════════════════════ */
function HoverRollSplitText({
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
  hoverRollDirection = "left",
  autoRoll = false,
  autoRollInterval = 2500,
  autoRollDuration = 400,
}: Omit<SplitTextProps, "tag">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  const units: string[] =
    splitType === "chars" ? text.split("") :
    splitType === "words" ? text.split(" ") :
    text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets   = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !targets.length) return;

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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label={text}
      role="text"
      style={{
        textAlign,
        lineHeight: "inherit",
        display: "flex",
        flexWrap: "wrap",
        gap: splitType === "chars" ? "0" : "0.25em",
      }}
    >
      {units.map((unit, i) => {
        if (unit === " " && splitType === "chars") {
          return (
            <span
              key={i}
              ref={(el) => { unitRefs.current[i] = el; }}
              aria-hidden="true"
              style={{ display: "inline-block" }}
            >
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => { unitRefs.current[i] = el; }}
            aria-hidden="true"
            style={{ display: "inline-block" }}
          >
            <TextRoll
              direction={hoverRollDirection}
              autoRoll={autoRoll}
              autoRollInterval={autoRollInterval + i * 120} /* stagger each unit slightly */
              autoRollDuration={autoRollDuration}
            >
              {unit}
            </TextRoll>
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STANDARD SPLIT TEXT  (no hover roll)
═══════════════════════════════════════════════════════════ */
function StandardSplitText({
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
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
            el.textContent        = char;
            el.style.display      = "inline-block";
            el.style.willChange   = "transform, opacity";
            wordEl.appendChild(el);
            spans.push(el);
          });

          container.appendChild(wordEl);

          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML       = "&nbsp;";
            sp.style.display   = "inline-block";
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
      if (container) container.innerHTML = text;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      className={className}
      style={{ textAlign, lineHeight: "inherit" }}
      aria-label={text}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC ENTRY POINT
═══════════════════════════════════════════════════════════ */
export default function SplitText(props: SplitTextProps) {
  if (props.hoverRoll) {
    return <HoverRollSplitText {...props} />;
  }
  return <StandardSplitText {...props} />;
}