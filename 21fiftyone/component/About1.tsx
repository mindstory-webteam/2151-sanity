"use client";

import { useRef, useEffect, useCallback, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion, useAnimation } from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimation>;
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ════════════════════════════════════════════════════════
   TEXT ROLL — auto + hover
════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.035;

function getRollDelay(i: number, total: number, direction: "left" | "right" | "center") {
  if (direction === "center") return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
  if (direction === "right")  return ROLL_STAGGER * (total - 1 - i);
  return ROLL_STAGGER * i;
}

interface TextRollCharProps {
  char: string;
  delay: number;
  duration: number;
  controls: AnimationControls;
}

const TextRollChar = ({ char, delay, duration, controls }: TextRollCharProps) => {
  const ch = char === " " ? "\u00A0" : char;
  return (
    <span style={{ display: "inline-block", position: "relative", overflow: "hidden", lineHeight: 0.88, verticalAlign: "top" }}>
      <motion.span
        style={{ display: "block" }}
        animate={controls}
        variants={{
          idle:    { y: "0%",    transition: { ease: "easeInOut", duration: duration / 1000, delay } },
          rolling: { y: "-100%", transition: { ease: "easeInOut", duration: duration / 1000, delay } },
          reset:   { y: "100%",  transition: { duration: 0 } },
        }}
      >{ch}</motion.span>
      <motion.span
        aria-hidden
        style={{ display: "block", position: "absolute", inset: 0, whiteSpace: "pre" }}
        animate={controls}
        variants={{
          idle:    { y: "100%",  transition: { ease: "easeInOut", duration: duration / 1000, delay } },
          rolling: { y: "0%",    transition: { ease: "easeInOut", duration: duration / 1000, delay } },
          reset:   { y: "200%",  transition: { duration: 0 } },
        }}
      >{ch}</motion.span>
    </span>
  );
};

interface TextRollUnitProps {
  children: string;
  direction?: "left" | "right" | "center";
  autoRoll?: boolean;
  autoRollInterval?: number;
  autoRollDuration?: number;
}

const TextRoll = ({
  children,
  direction = "left",
  autoRoll = false,
  autoRollInterval = 2500,
  autoRollDuration = 400,
}: TextRollUnitProps) => {
  const chars    = children.split("");
  const total    = chars.length;
  const controls = useAnimation();
  const hovering = useRef(false);
  const rolling  = useRef(false);

  const doRoll = useCallback(async () => {
    if (rolling.current) return;
    rolling.current = true;
    await controls.start("rolling");
    await controls.start("reset");
    await controls.start("idle");
    rolling.current = false;
  }, [controls]);

  useEffect(() => {
    if (!autoRoll) return;
    const id = setInterval(() => {
      if (!hovering.current) doRoll();
    }, autoRollInterval);
    return () => clearInterval(id);
  }, [autoRoll, autoRollInterval, doRoll]);

  return (
    <span
      onMouseEnter={() => { hovering.current = true;  doRoll(); }}
      onMouseLeave={() => { hovering.current = false; }}
      style={{ display: "inline-flex", cursor: "pointer", userSelect: "none", verticalAlign: "top" }}
    >
      {chars.map((ch, i) => (
        <TextRollChar
          key={i}
          char={ch}
          controls={controls}
          delay={getRollDelay(i, total, direction)}
          duration={autoRollDuration}
        />
      ))}
    </span>
  );
};

/* ════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════ */
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
  autoRoll?: boolean;
  autoRollInterval?: number;
  autoRollDuration?: number;
}

/* ════════════════════════════════════════════════════════
   HOVER ROLL SPLIT TEXT
════════════════════════════════════════════════════════ */
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
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  const units =
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tlRef.current?.play();
            observer.unobserve(container);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      tlRef.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        textAlign,
        lineHeight: "inherit",
        display: "flex",
        flexWrap: "wrap",
        gap: splitType === "chars" ? "0" : "0.2em",
      }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        if (unit === " " && splitType === "chars") {
          return (
            <span key={i} ref={(el) => { unitRefs.current[i] = el; }} style={{ display: "inline-block" }}>
              &nbsp;
            </span>
          );
        }
        return (
          <span key={i} ref={(el) => { unitRefs.current[i] = el; }} style={{ display: "inline-block" }}>
            <TextRoll
              direction={hoverRollDirection}
              autoRoll={autoRoll}
              autoRollInterval={autoRollInterval + i * 150}
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

/* ════════════════════════════════════════════════════════
   STANDARD SPLIT TEXT
════════════════════════════════════════════════════════ */
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
          wordEl.style.display = "inline-block";
          wordEl.style.whiteSpace = "nowrap";
          word.split("").forEach((char) => {
            const charEl = document.createElement("span");
            charEl.textContent = char;
            charEl.style.display = "inline-block";
            charEl.style.willChange = "transform, opacity";
            wordEl.appendChild(charEl);
            spans.push(charEl);
          });
          container.appendChild(wordEl);
          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML = "&nbsp;";
            sp.style.display = "inline-block";
            container.appendChild(sp);
          }
        });
        return spans;
      }
      if (splitType === "words") {
        return text.split(" ").map((word, wi, arr) => {
          const el = document.createElement("span");
          el.textContent = word + (wi < arr.length - 1 ? "\u00A0" : "");
          el.style.display = "inline-block";
          el.style.willChange = "transform, opacity";
          container.appendChild(el);
          return el;
        });
      }
      return text.split("\n").map((line) => {
        const el = document.createElement("span");
        el.textContent = line;
        el.style.display = "block";
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tlRef.current?.play();
            observer.unobserve(container);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
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

function SplitText(props: SplitTextProps) {
  if (props.hoverRoll) return <HoverRollSplitText {...props} />;
  return <StandardSplitText {...props} />;
}

/* ════════════════════════════════════════════════════════
   STYLES (unchanged)
════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ab-cream: #f2ede6;
    --ab-black: #0c0c0c;
    --ab-red:   #c8372d;
    --ab-muted: #8a8480;
    --ab-line:  rgba(12,12,12,0.12);
  }

  #about {
    background: var(--ab-cream);
    font-family: 'DM Sans', sans-serif;
  }

  .ab-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 24px;
    border-bottom: 1px solid var(--ab-line);
    margin-bottom: 48px;
    margin-top: 100px;
    opacity: 0;
    transform: translateY(16px);
    animation: abFadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .ab-label-l {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--ab-red);
  }
  .ab-label-r {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--ab-muted);
  }

  .ab-headline {
    font-family: 'Anton', sans-serif !important;
    font-size: clamp(80px, 11vw, 158px) !important;
    line-height: 0.88 !important;
    letter-spacing: -0.02em !important;
    color: var(--ab-black) !important;
    text-transform: uppercase;
    display: block;
    overflow: visible;
    justify-content: center;
  }
  .ab-headline-accent {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    font-size: clamp(60px, 8vw, 116px) !important;
    color: var(--ab-red) !important;
    line-height: 1 !important;
    letter-spacing: -0.01em !important;
    display: block;
    margin-top: 8px;
    overflow: visible;
    justify-content: center;
  }

  .ab-sub-wrap {
    opacity: 0;
    transform: translateY(20px);
    animation: abFadeUp 0.9s 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .ab-sub-main {
    font-size: clamp(16px, 1.6vw, 20px);
    font-weight: 500;
    color: var(--ab-black);
    line-height: 1.5;
    margin-bottom: 10px;
  }
  .ab-sub-side {
    font-size: 14px;
    font-weight: 300;
    color: var(--ab-muted);
    line-height: 1.85;
    max-width: 520px;
    margin: 0 auto;
  }

  #clip {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mask-clip-path {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 780px;
    height: 520px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(12,12,12,0.28), 0 4px 16px rgba(12,12,12,0.14);
    will-change: width, height, border-radius;
  }

  .stone-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 50;
    pointer-events: none;
  }

  .ab-scroll-overlay {
    position: absolute;
    bottom: 48px; left: 52px; right: 52px;
    z-index: 60;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .ab-overlay-big {
    font-family: 'Anton', sans-serif;
    font-size: clamp(48px, 6vw, 84px);
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--ab-cream);
    line-height: 0.9;
    text-shadow: 0 2px 32px rgba(0,0,0,0.55);
  }
  .ab-overlay-accent {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(17px, 2vw, 26px);
    color: rgba(242,237,230,0.72);
    line-height: 1.45;
    text-align: right;
    max-width: 260px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
  }

  .ab-marquee-wrap {
    width: 100%; background: var(--ab-black);
    overflow: hidden; padding: 22px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .ab-marquee-track {
    display: flex; width: max-content;
    animation: abMarquee 24s linear infinite;
  }
  .ab-marquee-track:hover { animation-play-state: paused; }
  .ab-marquee-item {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    padding: 0 32px; white-space: nowrap;
    transition: color 0.2s; cursor: default;
  }
  .ab-marquee-item:hover { color: var(--ab-red); }
  .ab-marquee-item.ab-dot {
    color: var(--ab-red); font-size: 9px;
    padding: 0 12px; letter-spacing: 0;
  }

  @keyframes abFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes abMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (max-width: 900px) {
    .ab-scroll-overlay { bottom: 28px; left: 28px; right: 28px; }
    .mask-clip-path { width: 560px; height: 380px; }
  }
  @media (max-width: 600px) {
    .ab-overlay-accent { display: none; }
    .mask-clip-path { width: 340px; height: 230px; }
  }
`;

/* ════════════════════════════════════════════════════════
   MARQUEE DATA
════════════════════════════════════════════════════════ */
const MARQUEE_RAW = [
  "Film Production","✦","Commercial / Ad","✦","Corporate Film","✦",
  "Event / Experience","✦","AI Content","✦","Photography","✦"
];

/* ════════════════════════════════════════════════════════
   ABOUT COMPONENT
════════════════════════════════════════════════════════ */
const About1 = () => {
  const clipRef    = useRef<HTMLDivElement>(null);
  const maskRef    = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Inject global styles once */
  useEffect(() => {
    const id = "ab-global-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* GSAP scroll animation */
  useEffect(() => {
    const clip    = clipRef.current;
    const mask    = maskRef.current;
    const video   = videoRef.current;
    const overlay = overlayRef.current;
    if (!clip || !mask || !video || !overlay) return;

    ScrollTrigger.refresh();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: clip,
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    tl
      .fromTo(
        mask,
        {
          width: mask.offsetWidth,
          height: mask.offsetHeight,
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(12,12,12,0.28), 0 4px 16px rgba(12,12,12,0.14)",
        },
        {
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          boxShadow: "none",
          ease: "power2.out",
        }
      )
      .fromTo(
        video,
        { scale: 1.6, opacity: 0.85 },
        { scale: 1,   opacity: 1,    ease: "power2.out" },
        "<"
      )
      .fromTo(
        overlay,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  /* Refresh on resize */
  useEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const doubled = [...MARQUEE_RAW, ...MARQUEE_RAW];

  return (
    <div id="about" className="min-h-screen w-screen">

      {/* ── Top text block ── */}
      <div className="relative mb-8 mt-86 flex flex-col items-center gap-5 px-4">

        <div className="ab-label-row w-full max-w-5xl">
          <span className="ab-label-l">WELCOME TO 21 FIFTYONE</span>
          <span className="ab-label-r">21FIFTYONE</span>
        </div>

        <div style={{ width: "100%", maxWidth: "1100px" }}>
          <SplitText
            text="DISCOVER STORIES"
            tag="div"
            className="ab-headline"
            delay={40}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-60px"
            textAlign="center"
            hoverRoll
            hoverRollDirection="center"
            autoRoll
            autoRollInterval={5000}
            autoRollDuration={620}
          />

          <SplitText
            text="SHARED EXPERIENCE"
            tag="div"
            className="ab-headline-accent"
            delay={80}
            duration={1.4}
            ease="power4.out"
            splitType="words"
            from={{ opacity: 0, y: 80, skewX: 8 }}
            to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.1}
            rootMargin="-60px"
            textAlign="center"
            hoverRoll
            hoverRollDirection="left"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />
        </div>

        <div className="ab-sub-wrap text-center">
          <p className="ab-sub-main">
            Video Production Company in Calicut Creating Powerful Visual Stories
          </p>
          <p className="ab-sub-side">
            At 21Fifty One, we bring film, branding, and digital storytelling together to craft stories that connect with people and leave a lasting impact.
          </p>
        </div>
      </div>

      {/* ── Scroll clip section ── */}
      <div className="h-dvh w-screen" id="clip" ref={clipRef}>
        <div className="mask-clip-path about-image" ref={maskRef}>
          <video
            ref={videoRef}
            className="stone-video"
            src="/videos/banner/0_Ladybug_Insect_1280x720.webm"
            autoPlay
            loop
            muted
            playsInline
          />
          <div ref={overlayRef} className="scroll-text ab-scroll-overlay" style={{ opacity: 0 }}>
            <div className="ab-overlay-big">
              WHERE STORIES <br /> COME ALIVE
            </div>
            <div className="ab-overlay-accent">
              Driven by vision —<br />
               shaped by creativity, emotion<br />
               and precision.
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="ab-marquee-wrap">
        <div className="ab-marquee-track">
          {doubled.map((item, i) => (
            <span
              key={i}
              className={`ab-marquee-item${item === "✦" ? " ab-dot" : ""}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About1;