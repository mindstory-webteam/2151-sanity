"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import React from "react";
import SplitText from "./Splittext"; // ← external import

/* ─── Design tokens ─── */
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

/* ─── Data ─── */
const SLIDES = [
  {
    number: "01", title: "DISCOVERY", subtitle: "Understanding Your Vision",
    body: "We begin by diving deep into your ideas, brand, and goals—uncovering the story that needs to be told and the impact it should create.",
    bg: "#0c0c0c", color: "#f2ede6",
  },
  {
    number: "02", title: "CONCEPT & DESIGN", subtitle: "Shaping the Story",
    body: " We develop concepts, storyboards, and visual styles that bring your story to life.",
    bg: "#1a1210", color: "#f2ede6",
  },
  {
    number: "03", title: "PRODUCTION", subtitle: "Bringing Ideas to Life",
    body: " From shoot to execution, we create high-quality visuals with cinematic precision.",
    bg: "#f2ede6", color: "#0c0c0c",
  },
  {
    number: "04", title: "DELIVERY", subtitle: "Finalizing the Experience",
    body: "We refine, edit, and deliver content optimized for maximum impact across platforms.",
    bg: "#2a1f1a", color: "#f2ede6",
  },
];

const MARQUEE_ITEMS = [
  "Film Production", "✦", "Commercial / Ad", "✦", "Corporate Film", "✦",
  "Event / Experience", "✦", "AI Content", "✦", "Photography", "✦",
];

/* ═══════════════════════════════════════════════════════════
   MARQUEE TEXT CARD
═══════════════════════════════════════════════════════════ */

const CARD_ITEMS = [
  { label: "Shoot Time",        value: "05:48 hrs",      sub: "Golden hour captured with precision and intent." },
  { label: "Frame Clarity",     value: "∞",              sub: "Every detail refined — no compromise on visual quality." },
  { label: "Locations Covered", value: "99.8%",          sub: "Clean air index" },
  { label: "Silence",           value: "12 +",           sub: "From studio-controlled sets to real-world environments." },
  { label: "Output Quality",    value: "4K • 8K • HDR",  sub: "Engineered for cinematic impact across every screen." },
];

function MarqueeTextCard() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="bs-mcard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bs-mcard-top">
        <span className="bs-mcard-badge">
          <span className="bs-mcard-dot" />
          Alpine Stats
        </span>
        <span className="bs-mcard-count">{CARD_ITEMS.length} entries</span>
      </div>

      <div className="bs-mcard-viewport">
        <div
          ref={trackRef}
          className="bs-mcard-track"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {[...CARD_ITEMS, ...CARD_ITEMS].map((item, i) => (
            <div key={i} className="bs-mcard-item">
              <span className="bs-mcard-label">{item.label}</span>
              <span className="bs-mcard-value">{item.value}</span>
              <span className="bs-mcard-sub">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bs-mcard-bottom">
        <span className="bs-mcard-ticker">
          {CARD_ITEMS.map((it, i) => (
            <React.Fragment key={i}>
              <span>{it.value}</span>
              {i < CARD_ITEMS.length - 1 && <span className="bs-mcard-sep">·</span>}
            </React.Fragment>
          ))}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BENEFIT SECTION
═══════════════════════════════════════════════════════════ */

export default function BenefitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const autoRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const slide = SLIDES[current];

  return (
    <>
      <style>{`
        ${FONTS}
        ${TOKENS}

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bs-root {
          width: 100%;
          background: var(--cream);
          overflow-x: clip;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          text-align: justify;
        }
        .bs-root::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .bs-section { padding: 120px 0 0; position: relative; }

        .bs-label-row {
          max-width: 1280px; margin: 0 auto; padding: 0 64px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 56px;
        }
        .bs-label-l { font-size: 10px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--red); }
        .bs-label-r { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }

        .bs-header {
          max-width: 1280px; margin: 0 auto; padding: 0 64px 80px;
        }

        .bs-headline-row {
          display: flex;
          align-items: stretch;
          gap: 20px;
          overflow: hidden;
        }
        .bs-headline-text-col {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .bs-headline-wrap {
          font-family: 'Anton', sans-serif;
          font-size: clamp(88px, 11vw, 158px);
          line-height: .88;
          letter-spacing: -.02em;
          color: var(--black);
          text-transform: uppercase;
          display: block;
          overflow: hidden;
        }
        .bs-headline-accent-wrap {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(64px, 8vw, 116px);
          color: var(--red);
          line-height: 1;
          letter-spacing: -.01em;
          display: block;
          margin-top: 8px;
          overflow: hidden;
        }

        /* ── Marquee text card ── */
        .bs-mcard {
          flex: 1 1 0;
          overflow: hidden;
          border-radius: 12px;
          background: var(--black);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: scale(0.96) translateY(12px);
          animation: mcReveal .9s .55s cubic-bezier(.16,1,.3,1) forwards;
          position: relative;
        }
        .bs-mcard::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 100%;
          background: linear-gradient(to bottom, var(--red), transparent);
          z-index: 2;
        }
        @keyframes mcReveal {
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .bs-mcard-top {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 10px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .bs-mcard-badge {
          display: flex; align-items: center; gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: .28em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .bs-mcard-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 0 3px rgba(200,55,45,0.25);
          animation: mcPulse 2s ease-in-out infinite;
        }
        @keyframes mcPulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(200,55,45,0.25); }
          50%      { box-shadow: 0 0 0 7px rgba(200,55,45,0.06); }
        }
        .bs-mcard-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
        .bs-mcard-viewport {
          flex: 1 1 0;
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
        }
        .bs-mcard-track {
          display: flex;
          flex-direction: column;
          animation: mcScroll 10s linear infinite;
        }
        @keyframes mcScroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .bs-mcard-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          min-height: 72px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          position: relative;
          transition: background .25s;
        }
        .bs-mcard-item:hover { background: rgba(255,255,255,0.03); }
        .bs-mcard-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 8px; font-weight: 500;
          letter-spacing: .32em; text-transform: uppercase;
          color: var(--red); margin-bottom: 3px;
        }
        .bs-mcard-value {
          font-family: 'Anton', sans-serif;
          font-size: clamp(22px, 2.8vw, 36px);
          letter-spacing: -.01em; color: #fff; line-height: 1;
        }
        .bs-mcard-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 300; letter-spacing: .12em;
          color: rgba(255,255,255,0.35); margin-top: 3px;
        }
        .bs-mcard-bottom {
          flex: 0 0 auto;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 9px 20px; overflow: hidden;
        }
        .bs-mcard-ticker {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: .22em; text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bs-mcard-sep { color: var(--red); opacity: .6; }

        /* Carousel */
        .bs-carousel {
          max-width: 1280px; margin: 0 auto; padding: 0 64px 100px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
        }
        .bs-slide-panel {
          position: relative; min-height: 500px; padding: 52px 52px 44px;
          display: flex; flex-direction: column; justify-content: space-between;
          transition: background .55s ease, color .55s ease; overflow: hidden;
        }
        .bs-slide-panel::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 56px; background: var(--red);
        }
        .bs-slide-num {
          font-size: 10px; font-weight: 500; letter-spacing: .3em;
          text-transform: uppercase; opacity: .4; margin-bottom: 32px;
        }
        .bs-slide-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(40px, 5.5vw, 70px);
          letter-spacing: -.01em; line-height: .93;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .bs-slide-subtitle {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(18px, 2vw, 26px); opacity: .6; margin-bottom: 24px;
        }
        .bs-slide-body {
          font-size: 15px; font-weight: 300; line-height: 1.8;
          max-width: 380px; opacity: .8;
        }
        .bs-slide-panel.entering .bs-slide-title,
        .bs-slide-panel.entering .bs-slide-subtitle,
        .bs-slide-panel.entering .bs-slide-body {
          animation: bsUp .55s cubic-bezier(.16,1,.3,1) forwards;
        }
        .bs-slide-panel.entering .bs-slide-subtitle { animation-delay: .06s; }
        .bs-slide-panel.entering .bs-slide-body     { animation-delay: .12s; }
        @keyframes bsUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bs-dot-row { display: flex; gap: 10px; margin-top: 32px; }
        .bs-dot {
          border: none; cursor: pointer; padding: 0; height: 8px;
          border-radius: 4px; transition: width .3s, background .3s;
        }

        /* Nav list */
        .bs-slide-nav { display: flex; flex-direction: column; background: var(--black); }
        .bs-nav-item {
          flex: 1; padding: 28px 36px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          cursor: pointer; position: relative; overflow: hidden;
          transition: background .3s; display: flex; align-items: center; gap: 20px;
        }
        .bs-nav-item:last-child { border-bottom: none; }
        .bs-nav-item:hover { background: rgba(255,255,255,.04); }
        .bs-nav-item.active { background: rgba(200,55,45,.1); }
        .bs-nav-item .bs-progress {
          position: absolute; bottom: 0; left: 0; height: 2px; background: var(--red); width: 0;
        }
        .bs-nav-item.active .bs-progress { animation: fillBar 4s linear forwards; }
        @keyframes fillBar { from { width: 0; } to { width: 100%; } }
        .bs-nav-num {
          font-size: 10px; font-weight: 500; letter-spacing: .2em;
          color: rgba(255,255,255,.3); flex-shrink: 0; transition: color .3s;
        }
        .bs-nav-item.active .bs-nav-num,
        .bs-nav-item:hover .bs-nav-num { color: var(--red); }
        .bs-nav-title {
          font-family: 'Anton', sans-serif; font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: .04em; text-transform: uppercase;
          color: rgba(255,255,255,.4); transition: color .3s;
        }
        .bs-nav-item.active .bs-nav-title,
        .bs-nav-item:hover .bs-nav-title { color: #fff; }
        .bs-nav-arrow {
          margin-left: auto; font-size: 18px;
          color: rgba(255,255,255,.2); transition: color .3s, transform .3s;
        }
        .bs-nav-item.active .bs-nav-arrow,
        .bs-nav-item:hover .bs-nav-arrow { color: var(--red); transform: translateX(4px); }

        /* Marquee */
        .bs-marquee-wrap {
          width: 100%; background: var(--black); overflow: hidden;
          padding: 22px 0; border-top: 1px solid rgba(255,255,255,.07);
        }
        .bs-marquee-track {
          display: flex; width: max-content;
          animation: bsMarquee 22s linear infinite;
        }
        .bs-marquee-track:hover { animation-play-state: paused; }
        @keyframes bsMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bs-marquee-item {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: .32em; text-transform: uppercase;
          color: rgba(255,255,255,.45); padding: 0 32px; white-space: nowrap; transition: color .2s;
        }
        .bs-marquee-item:hover { color: var(--red); }
        .bs-marquee-item.dot { color: var(--red); font-size: 9px; padding: 0 12px; letter-spacing: 0; }

        /* Scroll reveal */
        [data-reveal] {
          opacity: 0; transform: translateY(28px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="2"] { transition-delay: .14s; }
        [data-reveal][data-d="3"] { transition-delay: .28s; }

        /* Responsive */
        @media (max-width: 1000px) {
          .bs-header { padding: 0 28px 56px; }
          .bs-carousel { grid-template-columns: 1fr; padding: 0 28px 80px; }
          .bs-label-row { padding: 0 28px; }
          .bs-slide-nav { flex-direction: row; overflow-x: auto; }
          .bs-nav-item { flex-direction: column; align-items: flex-start; gap: 6px; min-width: 140px; }
          .bs-nav-arrow { display: none; }
          .bs-headline-row { flex-direction: column; }
          .bs-mcard { flex: none; height: 220px; border-radius: 10px; }
        }
        @media (max-width: 600px) {
          .bs-root::before { left: 24px; right: 24px; }
          .bs-slide-panel { padding: 36px 28px 32px; min-height: 380px; }
          .bs-mcard { height: 160px; }
        }
      `}</style>

      <div className="bs-root">
        <section className="bs-section" ref={sectionRef}>

          <div className="bs-label-row" data-reveal>
            <span className="bs-label-l">Mountain Experience</span>
            {/* <span className="bs-label-r">21FIFTYONE</span> */}
          </div>

          <div className="bs-header">
            <div className="bs-headline-row">

              {/* LEFT: both headline lines stacked */}
              <div className="bs-headline-text-col">
                <div className="bs-headline-wrap">
                  <SplitText
                    text="Step Into"
                    splitType="chars"
                    from={{ opacity: 0, y: 60, skewX: 4 }}
                    to={{ opacity: 1, y: 0, skewX: 0 }}
                    delay={40}
                    duration={1.25}
                    ease="power3.out"
                    threshold={0.15}
                    rootMargin="-80px"
                    hoverRoll
                    autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                    hoverRollDirection="left"
                  />
                </div>

                <div className="bs-headline-accent-wrap">
                  <SplitText
                    text="Creative Process"
                    splitType="words"
                    from={{ opacity: 0, y: 80 }}
                    to={{ opacity: 1, y: 0 }}
                    delay={120}
                    duration={1.4}
                    ease="power4.out"
                    threshold={0.15}
                    rootMargin="-80px"
                    hoverRoll
                    hoverRollDirection="center"
                    autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                  />
                </div>
              </div>

              {/* RIGHT: marquee text card */}
              {/* <MarqueeTextCard /> */}

            </div>
          </div>

          <div className="bs-carousel">
            <div
              className="bs-slide-panel entering"
              key={current}
              style={{ background: slide.bg, color: slide.color }}
            >
              <div>
                <p className="bs-slide-num">{slide.number} / 0{SLIDES.length}</p>
                <h3 className="bs-slide-title">{slide.title}</h3>
                <p className="bs-slide-subtitle">{slide.subtitle}</p>
                <p className="bs-slide-body">{slide.body}</p>
              </div>
              <div className="bs-dot-row">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className="bs-dot"
                    onClick={() => { if (autoRef.current) clearInterval(autoRef.current); goTo(i); }}
                    style={{
                      width: i === current ? "28px" : "8px",
                      background: i === current ? "var(--red)" : "rgba(255,255,255,0.25)",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bs-slide-nav">
              {SLIDES.map((s, i) => (
                <div
                  key={s.number}
                  className={`bs-nav-item${i === current ? " active" : ""}`}
                  onClick={() => { if (autoRef.current) clearInterval(autoRef.current); goTo(i); }}
                >
                  <span className="bs-nav-num">{s.number}</span>
                  <span className="bs-nav-title">{s.title}</span>
                  <span className="bs-nav-arrow">→</span>
                  <span className="bs-progress" />
                </div>
              ))}
            </div>
          </div>

          <div className="bs-marquee-wrap">
            <div className="bs-marquee-track">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className={`bs-marquee-item${item === "✦" ? " dot" : ""}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>

        </section>
      </div>
    </>
  );
}