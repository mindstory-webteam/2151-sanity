"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";
import { Fragment } from "react";

/* ─── CASE STUDY DATA ─── */
const CASE_STUDY = {
  badge: "Featured Case Study",
  titleBlack: "OUR",
  titleRed: "WORK",
  desc: "Redefining visual storytelling for a modern brand—through cinematic direction, refined aesthetics, and purposeful design.",
  video: "/videos/video-2.webm",
  meta: [
    { label: "Client",    value: "Aethelgard Motors" },
    { label: "Industry",  value: "Luxury Automotive" },
    { label: "Timeline",  value: "6 Months" },
    { label: "Expertise", value: "UX Strategy, UI Design" },
  ],
};

export default function FeaturedCaseStudy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        /* ══════════════════════════════════════
           SECTION WRAPPER
        ══════════════════════════════════════ */
        .fcs {
          width: 100%;
          background: var(--cream);
          overflow: visible;
          position: relative;
          padding: 0 0 0;
        }

        /* ══════════════════════════════════════
           HERO VISUAL — full-bleed video / image
        ══════════════════════════════════════ */
        .fcs-visual {
          width: 100%;
          /* 16:9-ish but taller on mobile */
          aspect-ratio: 16 / 8;
          position: relative;
          overflow: hidden;
          background: #111;
        }

        /* base dark bg — only visible while video loads */
        .fcs-visual-bg {
          position: absolute;
          inset: 0;
          background: #0c0c0c;
        }

        /* video fills the frame — full background */
        .fcs-visual video {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 1;
          mix-blend-mode: normal;
        }

        /* perspective grid lines — pure CSS */
        .fcs-grid-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .fcs-grid-lines::before,
        .fcs-grid-lines::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        /* horizontal lines (floor) */
        .fcs-grid-lines::before {
          width: 300%;
          height: 55%;
          background: repeating-linear-gradient(
            to top,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 1px,
            transparent 1px,
            transparent 48px
          );
          transform-origin: bottom center;
          transform: translateX(-50%) perspective(600px) rotateX(60deg);
        }
        /* vertical lines (floor) */
        .fcs-grid-lines::after {
          width: 300%;
          height: 55%;
          background: repeating-linear-gradient(
            to right,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 1px,
            transparent 1px,
            transparent 80px
          );
          transform-origin: bottom center;
          transform: translateX(-50%) perspective(600px) rotateX(60deg);
        }

        /* ceiling light strip */
        .fcs-ceiling-light {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28%;
          height: 3px;
          background: rgba(255,255,255,0.55);
          box-shadow: 0 0 60px 20px rgba(255,255,255,0.18),
                      0 0 120px 60px rgba(255,255,255,0.06);
          z-index: 2;
        }

        /* side wall lines */
        .fcs-wall-left,
        .fcs-wall-right {
          position: absolute;
          top: 0; bottom: 40%;
          width: 1px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.12), transparent);
          z-index: 2;
        }
        .fcs-wall-left  { left: 20%; }
        .fcs-wall-right { right: 20%; }

        /* dark overlay on top of video for text legibility */
        .fcs-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,10,0.45) 0%,
            rgba(10,10,10,0.25) 35%,
            rgba(10,10,10,0.55) 70%,
            rgba(10,10,10,0.80) 100%
          );
          z-index: 3;
        }

        /* content inside the visual */
        .fcs-content {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 72px 0;
        }

        /* badge pill */
        .fcs-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(200,55,45,0.18);
          border: 1px solid rgba(200,55,45,0.35);
          padding: 6px 14px 6px 10px;
          margin-bottom: 20px;
          width: fit-content;
        }
        .fcs-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--red);
          flex-shrink: 0;
        }
        .fcs-badge-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--red);
        }

        /* ── HEADLINE — same Hero2 clipping fix ── */
        .fcs-headline-wrap {
          overflow: visible;
          margin-bottom: 20px;
        }
        .fcs-headline {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0 0.2em;
          overflow: visible;
          line-height: 0.9;
        }

        /* Black part "Project" */
        .fcs-h-black {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(52px, 8vw, 120px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.01em !important;
          color: #fff !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-top: 8px !important;
          padding-bottom: 4px !important;
        }
        .fcs-h-black > div { overflow: visible !important; }
        .fcs-h-black [data-roll-unit] { overflow: hidden; }

        /* Red part "Lumina" */
        .fcs-h-red {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(52px, 8vw, 120px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.01em !important;
          color: var(--red) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-top: 8px !important;
          padding-bottom: 4px !important;
        }
        .fcs-h-red > div { overflow: visible !important; }
        .fcs-h-red [data-roll-unit] { overflow: hidden; }

        /* description */
        .fcs-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
          max-width: 400px;
          margin-bottom: 40px;
        }

        /* ══════════════════════════════════════
           META BAR — bottom strip
        ══════════════════════════════════════ */
        .fcs-meta-bar {
          width: 100%;
          background: #fff;
          border-top: 3px solid var(--red);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          z-index: 10;
        }

        .fcs-meta-item {
          padding: 32px 40px;
          border-right: 1px solid var(--line);
          position: relative;
          transition: background 0.3s ease;
          cursor: default;
        }
        .fcs-meta-item:last-child { border-right: none; }
        .fcs-meta-item:hover { background: #faf7f2; }

        /* red accent bar on hover */
        .fcs-meta-item::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 2px; width: 0;
          background: var(--red);
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .fcs-meta-item:hover::before { width: 100%; }

        .fcs-meta-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
          display: block;
          margin-bottom: 10px;
        }
        .fcs-meta-value {
          font-family: 'Anton', sans-serif;
          font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--black);
          display: block;
          line-height: 1.1;
        }

        /* ══════════════════════════════════════
           CTA ROW — sits between visual & meta
        ══════════════════════════════════════ */
        .fcs-cta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-bottom: 48px;
        }
        .fcs-divider {
          width: 1px; height: 36px;
          background: rgba(255,255,255,0.2);
        }
        .fcs-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fcs-link:hover { color: rgba(255,255,255,0.8); }

        /* ══════════════════════════════════════
           SCROLL REVEAL
        ══════════════════════════════════════ */
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.06s; }
        [data-reveal][data-d="2"] { transition-delay: 0.14s; }
        [data-reveal][data-d="3"] { transition-delay: 0.22s; }
        [data-reveal][data-d="4"] { transition-delay: 0.32s; }
        [data-reveal][data-d="5"] { transition-delay: 0.44s; }

        /* ══════════════════════════════════════
           MARQUEE TICKER STRIP
        ══════════════════════════════════════ */
        .fcs-marquee-strip {
          width: 100%;
          background: rgba(8,8,8,0.96);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          padding: 0;
          height: 44px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        /* fade edges */
        .fcs-marquee-strip::before,
        .fcs-marquee-strip::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .fcs-marquee-strip::before {
          left: 0;
          background: linear-gradient(to right, rgba(8,8,8,0.96), transparent);
        }
        .fcs-marquee-strip::after {
          right: 0;
          background: linear-gradient(to left, rgba(8,8,8,0.96), transparent);
        }

        .fcs-marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: fcsMarquee 28s linear infinite;
          will-change: transform;
        }
        .fcs-marquee-track:hover { animation-play-state: paused; }

        @keyframes fcsMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .fcs-marquee-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          padding: 0 28px;
          transition: color 0.2s;
          cursor: default;
          flex-shrink: 0;
        }
        .fcs-marquee-item:hover { color: rgba(255,255,255,0.85); }

        .fcs-marquee-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--red);
          flex-shrink: 0;
          opacity: 0.8;
        }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 900px) {
          .fcs-visual { aspect-ratio: 4 / 3; }
          .fcs-content { padding: 0 40px 0; }
          .fcs-meta-bar { grid-template-columns: 1fr 1fr; }
          .fcs-meta-item { padding: 24px 28px; }
          .fcs-meta-item:nth-child(2) { border-right: none; }
        }
        @media (max-width: 560px) {
          .fcs-visual { aspect-ratio: 3 / 4; min-height: 520px; }
          .fcs-content { padding: 0 24px 0; }
          .fcs-meta-bar { grid-template-columns: 1fr 1fr; }
          .fcs-meta-item { padding: 20px 20px; }
          .fcs-wall-left  { left: 8%; }
          .fcs-wall-right { right: 8%; }
        }
      `}</style>

      <section className="fcs" ref={sectionRef}>

        {/* ── MAIN VISUAL ── */}
        <div className="fcs-visual">

          {/* Architectural background */}
          <div className="fcs-visual-bg" />

          {/* Video layer */}
          <video src={CASE_STUDY.video} autoPlay muted loop playsInline />

          {/* Perspective grid */}
          <div className="fcs-grid-lines" />

          {/* Ceiling light */}
          <div className="fcs-ceiling-light" />
          <div className="fcs-wall-left" />
          <div className="fcs-wall-right" />

          {/* Dark overlay for text legibility */}
          <div className="fcs-overlay" />

          {/* Content */}
          <div className="fcs-content">

            {/* Badge */}
            {/* <div className="fcs-badge" data-reveal>
              <span className="fcs-badge-dot" />
              <span className="fcs-badge-text">{CASE_STUDY.badge}</span>
            </div> */}

            {/* Headline: "Project" + "Lumina" side by side */}
            <div className="fcs-headline-wrap" data-reveal data-d="1">
              <div className="fcs-headline">
                <SplitText
                  text={CASE_STUDY.titleBlack}
                  tag="div"
                  className="fcs-h-black"
                  delay={36}
                  duration={1.1}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 60 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.05}
                  rootMargin="-20px"
                  textAlign="left"
                  hoverRoll
                  hoverRollDirection="center"
                  autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                  
                />
                <SplitText
                  text={CASE_STUDY.titleRed}
                  tag="div"
                  className="fcs-h-red"
                  delay={32}
                  duration={1.15}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 60 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.05}
                  rootMargin="-20px"
                  textAlign="left"
                  hoverRoll
                  hoverRollDirection="left"
                  autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                />
              </div>
            </div>

            {/* Description */}
            <p className="fcs-desc" data-reveal data-d="2">
              {CASE_STUDY.desc}
            </p>

            {/* CTA */}
            <div className="fcs-cta-row" data-reveal data-d="3">
              <RollButton label="View Case Study" href="/studio" />
              <div className="fcs-divider" />
              {/* <a className="fcs-link" href="/work">All Projects</a> */}
            </div>

          </div>
        </div>

        {/* ── MARQUEE TICKER STRIP ── */}
        {(() => {
          const ITEMS = [
            "Film Production","✦","Commercial / Ad","✦","Corporate Film","✦",
  "Event / Experience","✦","AI Content","✦","Photography","✦"
          ];
          // duplicate for seamless loop
          const all = [...ITEMS, ...ITEMS];
          return (
            <div className="fcs-marquee-strip">
              <div className="fcs-marquee-track">
               {all.map((item, i) => (
  <Fragment key={`item-${i}`}>
    <span className="fcs-marquee-item">{item}</span>
    <span className="fcs-marquee-dot" />
  </Fragment>
))}
              </div>
            </div>
          );
        })()}

        {/* ── META BAR ── */}
        {/* <div className="fcs-meta-bar">
          {CASE_STUDY.meta.map((m, i) => (
            <div className="fcs-meta-item" key={m.label} data-reveal data-d={String(i + 1)}>
              <span className="fcs-meta-label">{m.label}</span>
              <span className="fcs-meta-value">{m.value}</span>
            </div>
          ))}
        </div> */}

      </section>
    </>
  );
}