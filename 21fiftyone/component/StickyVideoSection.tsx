"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─── Design tokens — defined locally in this file ─── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const TOKENS = `
  :root {
    --cream: #f2ede6;
    --black: #0c0c0c;
    --red:   #c8372d;
    --muted: #8a8480;
    --line:  rgba(12,12,12,0.12);
  }
`;

/* ─── Data ──────────────────────────────────────────── */
const VIDEO_SLIDES = [
  {
    tag: "01 — Terrain",
    heading: "Raw Alpine\nWilderness",
    body: "Untouched by roads and untracked by crowds. The alpine wilderness reveals itself only to those patient enough to listen — and bold enough to climb.",
    stat: ["3,200m", "Peak Altitude"],
  },
  {
    tag: "02 — Climate",
    heading: "Wind &\nSilence",
    body: "At this elevation the wind carries stories. Each gust shapes the pines, sculpts the rock and reminds you that nature has been here far longer than you.",
    stat: ["−18 °C", "Winter Low"],
  },
  {
    tag: "03 — Ecology",
    heading: "Ancient\nForests",
    body: "Centuries-old conifers stand guard over an ecosystem in perfect balance. Step inside and time slows to the pace of roots and rainfall.",
    stat: ["800yr", "Oldest Tree"],
  },
  {
    tag: "04 — Culture",
    heading: "Summit\nRituals",
    body: "Every culture that has called these peaks home has left offerings at the top. We carry that tradition forward — with gratitude and wonder.",
    stat: ["12", "Sacred Sites"],
  },
];

export default function StickyVideoSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLDivElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const h0 = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLDivElement>(null);
  const h2 = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % VIDEO_SLIDES.length), [current, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 4500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  useEffect(() => {
    if (!wrapperRef.current || !videoRef.current || !leftRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      /* Video starts completely fullscreen (inset 0 0 0 0%).
         Left panel starts fully off-screen to the left.
         On scroll → left panel slides in AND video clips to right half. */
      gsap.set(leftRef.current!, { xPercent: -100, opacity: 0 });
      gsap.set(videoRef.current!, { clipPath: "inset(0 0% 0 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current!,
          start: "top top",
          end: "+=2800",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      /* Slide left panel in */
      tl.to(leftRef.current!, { xPercent: 0, opacity: 1, ease: "power2.inOut", duration: 0.45 }, 0);
      /* Clip video to right half simultaneously */
      tl.to(videoRef.current!, { clipPath: "inset(0 50% 0 0%)", ease: "power2.inOut", duration: 0.7 }, 0.3);
    });

    mm.add("(max-width: 767.9px)", () => {
      gsap.set(leftRef.current!, { yPercent: 50, opacity: 0 });
      ScrollTrigger.create({
        trigger: wrapperRef.current!,
        start: "top top",
        end: "+=1400",
        scrub: 1.5,
        pin: true,
        onUpdate(self) {
          gsap.set(leftRef.current!, {
            yPercent: 50 - self.progress * 50,
            opacity: Math.min(1, self.progress * 2),
          });
        },
      });
    });

    /* Heading chars — reference style: y:60, skewX */
    const splits: InstanceType<typeof SplitText>[] = [];
    ([
      [h0.current, 4, 0],
      [h1.current, 4, 0.12],
      [h2.current, 8, 0.24],
    ] as [HTMLElement | null, number, number][]).forEach(([el, skewX, delay]) => {
      if (!el) return;
      const s = new SplitText(el, { type: "chars", charsClass: "svs-char" });
      splits.push(s);
      gsap.set(s.chars, { opacity: 0, y: 60, skewX });
      gsap.to(s.chars, {
        opacity: 1, y: 0, skewX: 0,
        stagger: 0.04, duration: 1.3, ease: "power3.out", delay,
        scrollTrigger: { trigger: wrapperRef.current!, start: "top 90%" },
      });
    });

    return () => {
      splits.forEach(s => s.revert());
      mm.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const slide = VIDEO_SLIDES[current];

  return (
    <>
      <style>{`
        ${FONTS}
        ${TOKENS}

        .svs-outer {
          width: 100%;
          background: var(--black);
          font-family: 'DM Sans', sans-serif;
          overflow-x: clip;
        }

        /* Pinned full-viewport wrapper */
        .svs-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* ── VIDEO: starts fullscreen, clips to right half on scroll ── */
        .svs-video {
          position: absolute;
          inset: 0;
          clip-path: inset(0 0% 0 0%);
          will-change: clip-path;
          z-index: 1;
        }
        .svs-video video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Gradient so left panel text stays legible over video */
        .svs-video::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to right,
            rgba(12,12,12,.88) 0%,
            rgba(12,12,12,.4) 42%,
            transparent 68%
          );
        }

        /* ── LEFT PANEL: slides in from off-screen left ── */
        .svs-left {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 50%;
          z-index: 10;
          will-change: transform, opacity;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 60px 80px 72px;
        }

        /* Eyebrow */
        .svs-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 44px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .svs-eyebrow::before {
          content: '';
          width: 32px;
          height: 1px;
          background: var(--red);
          flex-shrink: 0;
        }

        /* Anton headings */
        .svs-headline {
          font-family: 'Anton', sans-serif;
          font-size: clamp(72px, 7.5vw, 124px);
          line-height: .88;
          letter-spacing: -.02em;
          color: var(--cream);
          text-transform: uppercase;
          display: block;
          overflow: hidden;
        }
        .svs-headline-accent {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(52px, 5.5vw, 90px);
          color: var(--red);
          line-height: 1;
          letter-spacing: -.01em;
          display: block;
          margin-top: 6px;
          overflow: hidden;
        }
        .svs-char { display: inline-block; }

        /* Divider */
        .svs-divider {
          width: 48px;
          height: 1px;
          background: rgba(255,255,255,.18);
          margin: 40px 0 36px;
        }

        /* Slide content */
        .svs-slide-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .3em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 14px;
        }
        .svs-slide-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(30px, 3vw, 46px);
          letter-spacing: -.01em;
          line-height: .93;
          text-transform: uppercase;
          color: var(--cream);
          margin-bottom: 18px;
          white-space: pre-line;
        }
        .svs-slide-body {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(242,237,230,.55);
          max-width: 360px;
          margin-bottom: 32px;
        }

        /* Stat chip */
        .svs-stat {
          display: inline-flex;
          flex-direction: column;
          padding: 16px 24px;
          border: 1px solid rgba(255,255,255,.12);
          margin-bottom: 40px;
          position: relative;
        }
        .svs-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px;
          height: 100%;
          background: var(--red);
        }
        .svs-stat-num {
          font-family: 'Anton', sans-serif;
          font-size: clamp(28px, 3vw, 42px);
          color: var(--cream);
          letter-spacing: -.02em;
          line-height: 1;
        }
        .svs-stat-label {
          font-size: 10px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
          margin-top: 4px;
        }

        /* Slide enter animation */
        .svs-content.entering .svs-slide-tag,
        .svs-content.entering .svs-slide-title,
        .svs-content.entering .svs-slide-body,
        .svs-content.entering .svs-stat {
          animation: svsUp .55s cubic-bezier(.16,1,.3,1) forwards;
        }
        .svs-content.entering .svs-slide-title { animation-delay: .06s; }
        .svs-content.entering .svs-slide-body  { animation-delay: .12s; }
        .svs-content.entering .svs-stat        { animation-delay: .17s; }
        @keyframes svsUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Dot nav */
        .svs-dots { display: flex; gap: 10px; }
        .svs-dot {
          border: none; cursor: pointer; padding: 0; height: 8px;
          border-radius: 4px; transition: width .35s, background .35s;
        }

        /* Progress bar */
        .svs-progress-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(255,255,255,.06);
        }
        .svs-progress-fill {
          height: 100%; background: var(--red);
          animation: svsProgress 4.5s linear infinite;
        }
        @keyframes svsProgress { from { width: 0; } to { width: 100%; } }

        /* Spinning badge + play — sit on the right/video side */
        .svs-spin {
          position: absolute;
          top: 50%; right: 26%;
          width: clamp(110px, 12vw, 168px);
          height: clamp(110px, 12vw, 168px);
          transform: translate(50%, -50%);
          z-index: 5; pointer-events: none;
          animation: svsSpin 14s linear infinite;
        }
        @keyframes svsSpin {
          to { transform: translate(50%, -50%) rotate(360deg); }
        }

        .svs-play {
          position: absolute;
          top: 50%; right: 26%;
          transform: translate(50%, -50%);
          z-index: 6;
          width: clamp(52px, 5vw, 68px);
          height: clamp(52px, 5vw, 68px);
          border-radius: 50%;
          background: rgba(242,237,230,.16);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(242,237,230,.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform .25s, background .25s;
        }
        .svs-play:hover {
          transform: translate(50%, -50%) scale(1.1);
          background: rgba(242,237,230,.28);
        }

        /* Scroll hint */
        .svs-scroll-hint {
          position: absolute; bottom: 40px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 12; pointer-events: none;
          animation: svsHintBob 2.4s ease-in-out infinite;
        }
        @keyframes svsHintBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        .svs-scroll-hint span {
          font-size: 9px; letter-spacing: .3em; text-transform: uppercase;
          color: rgba(255,255,255,.35);
        }
        .svs-scroll-hint-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,.35), transparent);
        }

        @media (max-width: 900px) {
          .svs-left { width: 100%; padding: 48px 28px; }
          .svs-spin, .svs-play { right: 10%; }
        }
        @media (max-width: 600px) {
          .svs-headline       { font-size: 56px; }
          .svs-headline-accent { font-size: 44px; }
        }
      `}</style>

      <div className="svs-outer">
        <div ref={wrapperRef} className="svs-wrapper">

          {/* FULLSCREEN video — clips to right half on scroll */}
          <div ref={videoRef} className="svs-video">
            <video
              src="https://www.pexels.com/download/video/8290926/"
              autoPlay muted loop playsInline
            />
          </div>

          {/* Left panel — slides in from off-screen left */}
          <div ref={leftRef} className="svs-left">
            <p className="svs-eyebrow">The Mountain Experience</p>

            <div>
              <div className="svs-headline" ref={h0}>Beyond</div>
              <div className="svs-headline" ref={h1}>The</div>
              <div className="svs-headline-accent" ref={h2}>Ridge Line</div>
            </div>

            <div className="svs-divider" />

            <div className="svs-content entering" key={current}>
              <p className="svs-slide-tag">{slide.tag}</p>
              <h3 className="svs-slide-title">{slide.heading}</h3>
              <p className="svs-slide-body">{slide.body}</p>
              <div className="svs-stat">
                <span className="svs-stat-num">{slide.stat[0]}</span>
                <span className="svs-stat-label">{slide.stat[1]}</span>
              </div>
            </div>

            <div className="svs-dots">
              {VIDEO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className="svs-dot"
                  onClick={() => { if (autoRef.current) clearInterval(autoRef.current); goTo(i); }}
                  style={{
                    width: i === current ? "28px" : "8px",
                    background: i === current ? "var(--red)" : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="svs-progress-bar">
              <div className="svs-progress-fill" key={current} />
            </div>
          </div>

          {/* Badge + play button — stays on video side */}
          <img
            src="https://i.ibb.co/kgFKP37B/rotate-text.png"
            alt="rotating ring"
            className="svs-spin"
          />
          <div className="svs-play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>

          <div className="svs-scroll-hint">
            <span>Scroll</span>
            <div className="svs-scroll-hint-line" />
          </div>

        </div>
      </div>
    </>
  );
}