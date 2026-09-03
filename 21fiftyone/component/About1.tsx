"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ════════════════════════════════════════════════════════
   STYLES
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
    width: 100%;
    overflow: visible;
    text-align: center !important;
    opacity: 0;
    transform: translateY(40px);
    animation: abFadeUp 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .ab-headline-accent {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    font-size: clamp(60px, 8vw, 116px) !important;
    color: var(--ab-red) !important;
    line-height: 1.05 !important;
    letter-spacing: -0.01em !important;
    display: block;
    width: 100%;
    margin: 8px auto 0;
    overflow: visible;
    text-align: center !important;
    opacity: 0;
    transform: translateY(40px);
    animation: abFadeUp 0.9s 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
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
          {/* <span className="ab-label-l">WELCOME TO 21 FIFTYONE</span>
          <span className="ab-label-r">21FIFTYONE</span> */}
        </div>

        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <div className="ab-headline">DISCOVER STORIES</div>
          <div className="ab-headline-accent">SHARED EXPERIENCE</div>
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