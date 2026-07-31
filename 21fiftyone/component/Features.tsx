"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import RollButton from "./Rollbutton";
import SplitText from "./Splittext"; // ← external import

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --sv-cream: #f2ede6;
    --sv-white: #ffffff;
    --sv-black: #0c0c0c;
    --sv-red:   #c8372d;
    --sv-muted: #8a8480;
    --sv-line:  rgba(12,12,12,0.10);
    --sv-card-bg: #f7f3ee;
  }

  #services {
    background: var(--sv-white);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── label row ── */
  .sv-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 20px;
    border-bottom: 1px solid var(--sv-line);
    margin-bottom: 52px;
    opacity: 0;
    transform: translateY(16px);
    animation: svFadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .sv-label-l {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--sv-red);
  }
  .sv-label-r {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--sv-muted);
  }

  /* ── two-column header ── */
  .sv-header-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: end;
    margin-bottom: 72px;
  }

  /* Line 1 — Anton bold uppercase */
  .sv-headline {
    font-family: 'Anton', sans-serif !important;
    font-size: clamp(52px, 8vw, 128px) !important;
    line-height: 0.86 !important;
    letter-spacing: -0.03em !important;
    color: var(--sv-black) !important;
    text-transform: uppercase;
    display: block;
    overflow: visible;
    justify-content: flex-start;
  }

  /* Line 2 — Playfair italic red */
  .sv-headline-accent {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    font-size: clamp(40px, 6.5vw, 104px) !important;
    color: var(--sv-red) !important;
    line-height: 1.0 !important;
    letter-spacing: -0.02em !important;
    font-weight: 400 !important;
    display: block;
    overflow: visible;
    justify-content: flex-start;
    margin-top: 4px;
  }

  /* ── right column ── */
  .sv-header-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 8px;
    gap: 24px;
    opacity: 0;
    transform: translateY(18px);
    animation: svFadeUp 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .sv-sub-main {
    font-size: clamp(15px, 1.4vw, 18px);
    font-weight: 500;
    color: var(--sv-black);
    line-height: 1.55;
    margin-bottom: 4px;
  }
  .sv-sub-side {
    font-size: 14px;
    font-weight: 300;
    color: var(--sv-muted);
    line-height: 1.9;
    margin-bottom: 8px;
  }

  /* ── Bento large ── */
  .sv-bento-large {
    position: relative;
    width: 100%;
    height: 60vh;
    min-height: 380px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid var(--sv-line);
  }

  /* ── Bento grid ── */
  .sv-bento-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 20px;
  }

  /* ── Bottom row: 3 equal columns ── */
  .sv-bento-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .sv-bento-cell {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--sv-line);
    background: var(--sv-card-bg);
    min-height: 280px;
  }
  .sv-bento-cell.tall {
    grid-row: span 2;
    min-height: 580px;
  }
  .sv-bento-cell.accent {
    background: var(--sv-black);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px;
  }

  /* ── card inner ── */
  .sv-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 28px;
    z-index: 10;
  }
  .sv-card-video {
    position: absolute;
    inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center; z-index: 0;
  }
  .sv-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(12,12,12,0.04) 0%, rgba(12,12,12,0.62) 100%);
    z-index: 1;
  }

  /* ── card title ── */
  .sv-card-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(32px, 3.5vw, 58px);
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #ffffff;
    position: relative; z-index: 2;
  }
  .sv-card-title-serif {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(24px, 2.5vw, 44px);
    line-height: 1.1;
    color: var(--sv-red);
    position: relative; z-index: 2;
  }
  .sv-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300; line-height: 1.75;
    color: rgba(255,255,255,0.65);
    max-width: 260px;
    position: relative; z-index: 2;
    margin-top: 8px;
  }

  /* ── number badge ── */
  .sv-num {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 11px; letter-spacing: 0.12em;
    color: var(--sv-red); margin-bottom: 12px; display: block;
    position: relative; z-index: 2;
  }

  /* ── explore circle button ── */
  .sv-explore-btn {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0.6);
    z-index: 20;
    width: 88px; height: 88px;
    border-radius: 50%;
    background: var(--sv-red);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 2px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1),
                transform 0.35s cubic-bezier(0.16,1,0.3,1);
    cursor: pointer;
  }
  .sv-explore-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: #fff; line-height: 1;
  }
  .sv-explore-arrow {
    color: #fff; font-size: 16px; line-height: 1;
    margin-top: 2px;
  }

  /* show on parent hover */
  .sv-bento-large:hover .sv-explore-btn,
  .sv-bento-cell:hover .sv-explore-btn {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    pointer-events: auto;
  }

  /* ── accent card ── */
  .sv-accent-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(32px, 3.5vw, 56px);
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--sv-cream);
    max-width: 260px;
  }

  /* ── keyframes ── */
  @keyframes svFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── responsive ── */
  @media (max-width: 900px) {
    .sv-header-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .sv-bento-grid { grid-template-columns: 1fr; }
    .sv-bento-cell.tall { grid-row: span 1; min-height: 320px; }
    .sv-bento-large { height: 50vw; min-height: 260px; }
    .sv-bento-row { grid-template-columns: 1fr; }
  }
`;

/* ════════════════════════════════════════════════════════
   BENTO TILT
════════════════════════════════════════════════════════ */
const BentoTilt = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [ts, setTs] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const tiltX = ((e.clientY - top) / height - 0.5) * 6;
    const tiltY = ((e.clientX - left) / width - 0.5) * -6;
    setTs(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.97,0.97,0.97)`);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setTs("")}
      style={{ transform: ts, transition: ts ? "none" : "transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}
    >
      {children}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   EXPLORE CIRCLE BUTTON
════════════════════════════════════════════════════════ */
const ExploreBtn = () => (
  <Link href="/services" className="sv-explore-btn">
    <div className="sv-explore-btn">
      <span className="sv-explore-label">Explore</span>
      <span className="sv-explore-arrow">↗</span>
    </div>
  </Link>
);

/* ════════════════════════════════════════════════════════
   SERVICES DATA
════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: "01", src: "/videos/banner/s-1.webm",
    title: "VISUAL PRODUCTION",
    desc: "We create brand videos, product visuals, campaign content, and social media video assets with a clear visual style. From idea to final edit, each output is planned for the platform where it will be used.",
    large: true,
  },
  {
    id: "02", src: "/videos/banner/s-2.webm",
    title: "MOVIE PRODUCTION",
    desc: "We support short films, music-led stories, cinematic projects, and narrative video content with script development, direction, shoot planning, and post-production.",
    tall: true,
  },
  {
    id: "03", src: "/videos/banner/s-3.webm",
    title: "CORPORATE FILMS",
    desc: "We create company profile videos, leadership videos, training videos, interview-led stories, and business presentation films that explain your brand in a professional way.",
  },
  {
    id: "04", src: "/videos/banner/s-4.webm",
    title: "COMMERCIAL PRODUCTION",
    desc: "We produce ad films, product commercials, launch videos, digital ads, and campaign creatives for brands that need focused video content for marketing.",
  },
  {
    id: "05", src: "/videos/banner/s-5.webm",
    title: "AI PRODUCTION",
    desc: "We use AI tools to support creative production, concept visuals, AI video anchors, product explainers, hybrid content, and faster campaign asset creation.",
  },
  {
    id: "06", src: "/videos/banner/s-6.webm",
    title: "ENTERTAINMENT EVENTS",
    desc: "We cover and produce event visuals for launches, performances, brand experiences, cultural programs, corporate events, and digital event promotions.",
  },
];

/* ════════════════════════════════════════════════════════
   FEATURES / SERVICES SECTION
════════════════════════════════════════════════════════ */
const Features = () => {

  useEffect(() => {
    const id = "sv-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const [large, ...gridCards] = SERVICES;

  return (
    <section id="services" className="min-h-screen w-screen">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 40px 120px" }}>

        {/* ── Label row ── */}
        <div className="sv-label-row">
          <span className="sv-label-l">What We Do</span>
          {/* <span className="sv-label-r">Services — 2025</span> */}
        </div>

        {/* ── Two-column header ── */}
        <div className="sv-header-grid">

          {/* LEFT — big headings using imported SplitText */}
          <div>
            <SplitText
              text="Our Core"
              tag="div"
              className="sv-headline"
              delay={30}
              duration={1.1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 70 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="left"
              autoRoll
              autoRollInterval={5500}
              autoRollDuration={620}
            />
            <SplitText
              text="Services"
              tag="div"
              className="sv-headline-accent"
              delay={55}
              duration={1.35}
              ease="power4.out"
              splitType="words"
              from={{ opacity: 0, y: 60, skewX: 6 }}
              to={{ opacity: 1, y: 0, skewX: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="left"
              autoRoll
              autoRollInterval={5500}
              autoRollDuration={620}
            />
          </div>

          {/* RIGHT — sub copy + RollButton */}
          <div className="sv-header-right">
            <div>
              <p className="sv-sub-main">
                The Art of Visual Storytelling
              </p>
              <p className="sv-sub-side">
                Blending imagination, emotion, and precision—
                to create stories that feel as powerful as they look
              </p>
            </div>
            <RollButton label="view Services" href="/services" />
          </div>
        </div>

        {/* ── Large hero card ── */}
        <BentoTilt className="sv-bento-large">
          <video src={large.src} loop muted autoPlay className="sv-card-video" />
          <div className="sv-card-overlay" />
          <div className="sv-card-inner">
            <div>
              <span className="sv-num">{large.id} /</span>
              <h2 className="sv-card-title">{large.title}</h2>
              <p className="sv-card-desc">{large.desc}</p>
            </div>
          </div>
          <ExploreBtn />
        </BentoTilt>

        {/* ── 2×2 bento grid (cards 02–04) ── */}
        <div className="sv-bento-grid">

          {/* Card 2 — tall left */}
          <BentoTilt className="sv-bento-cell tall">
            <video src={gridCards[0].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[0].id} /</span>
                <h2 className="sv-card-title">{gridCards[0].title}</h2>
                <p className="sv-card-desc">{gridCards[0].desc}</p>
              </div>
            </div>
            <ExploreBtn />
          </BentoTilt>

          {/* Card 3 — top right */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[1].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[1].id} /</span>
                <h2 className="sv-card-title">{gridCards[1].title}</h2>
                <p className="sv-card-desc">{gridCards[1].desc}</p>
              </div>
            </div>
            <ExploreBtn />
          </BentoTilt>

          {/* Card 4 — bottom right */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[2].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[2].id} /</span>
                <h2 className="sv-card-title">{gridCards[2].title}</h2>
                <p className="sv-card-desc">{gridCards[2].desc}</p>
              </div>
            </div>
            <ExploreBtn />
          </BentoTilt>

        </div>

        {/* ── Bottom row: cards 05, 06 + accent ── */}
        <div className="sv-bento-row">

          {/* Card 5 — AI Production */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[3].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[3].id} /</span>
                <h2 className="sv-card-title">{gridCards[3].title}</h2>
                <p className="sv-card-desc">{gridCards[3].desc}</p>
              </div>
            </div>
            <ExploreBtn />
          </BentoTilt>

          {/* Card 6 — Entertainment Events */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[4].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[4].id} /</span>
                <h2 className="sv-card-title">{gridCards[4].title}</h2>
                <p className="sv-card-desc">{gridCards[4].desc}</p>
              </div>
            </div>
            <ExploreBtn />
          </BentoTilt>

          {/* Accent card — dark bg */}
          <BentoTilt className="sv-bento-cell accent">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <h2 className="sv-accent-title">
                Mo<b>r</b>e<br />Comin<b>g</b><br />So<b>o</b>n.
              </h2>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
                style={{ alignSelf: "flex-end" }}>
                <circle cx="26" cy="26" r="25" stroke="var(--sv-red)" strokeWidth="1.5" />
                <path d="M18 26h16M28 19l7 7-7 7" stroke="var(--sv-red)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </BentoTilt>

        </div>

      </div>
    </section>
  );
};

export default Features;