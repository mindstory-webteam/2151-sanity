"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";

export default function FivePillarsSection() {
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
      { threshold: 0.1 }
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

        /* ── SECTION WRAPPER ─────────────────────────── */
        .pillars {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 0;
          overflow: visible;
          position: relative;
          margin-bottom: 120px;
        }

        .pillars-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 80px;
          overflow: visible;
        }

        /* ── SECTION HEADER ── */
        .pillars-header {
          text-align: center;
          margin-bottom: 72px;
          overflow: visible;
        }
        .pillars-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--red);
          display: block;
          margin-bottom: 14px;
        }

        /* ── SHARED TITLE BASE ── */
        .pillars-title {
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-right: 6px !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
          line-height: 0.93 !important;
          color: var(--black) !important;
          text-transform: uppercase;
        }
        .pillars-title > div {
          overflow: visible !important;
          justify-content: center;
        }
        .pillars-title [data-roll-unit] { overflow: hidden; }

        /* ── LINE 1: Anton bold caps — "THE FIVE" ── */
        .pillars-title--sans {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(56px, 8vw, 108px) !important;
          letter-spacing: 0.03em !important;
          margin-bottom: 0 !important;
        }

        /* ── LINE 2: Playfair italic — "Pillars" ── */
        .pillars-title--serif {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(44px, 6.5vw, 88px) !important;
          letter-spacing: 0.01em !important;
          text-transform: none !important;
          color: var(--red) !important;
          margin-top: -8px !important;
        }

        /* ── BENTO GRID ── */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto auto;
          gap: 3px;
        }

        /* shared card base */
        .p-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px 44px;
          background: #ece7df;
          min-height: 340px;
          cursor: default;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .p-card:hover { transform: translateY(-3px); }

        /* ── CARD PLACEMENTS ── */
        .p-card--1 { grid-column: 1 / 8;  grid-row: 1; min-height: 380px; }
        .p-card--2 { grid-column: 8 / 13; grid-row: 1; min-height: 380px; }
        .p-card--3 { grid-column: 1 / 5;  grid-row: 2; min-height: 340px; }
        .p-card--4 { grid-column: 5 / 13; grid-row: 2; min-height: 340px; background: var(--black); }

        /* ── CARD CONTENT ── */
        .p-card__icon {
          position: absolute;
          top: 40px;
          right: 44px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red);
        }
        .p-card__icon svg { width: 28px; height: 28px; }

        .p-card__deco {
          position: absolute;
          top: 50%;
          left: 55%;
          transform: translate(-50%, -60%);
          width: 120px;
          height: 120px;
          opacity: 0.18;
          pointer-events: none;
        }

        .p-card--4::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(200,55,45,0.06) 0%, transparent 70%),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.018) 60px,
              rgba(255,255,255,0.018) 61px
            );
          pointer-events: none;
        }

        .p-card:not(.p-card--4)::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .p-card__num {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 20px;
          display: block;
          position: relative;
          z-index: 1;
        }

        .p-card__title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(22px, 2.8vw, 38px);
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--black);
          line-height: 1.0;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
          transition: color 0.25s;
        }
        .p-card--4 .p-card__title { color: #fff; font-size: clamp(28px, 3.8vw, 52px); }
        .p-card:hover .p-card__title { color: var(--red); }
        .p-card--4:hover .p-card__title { color: #fff; }

        .p-card__desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.75;
          color: #5a5450;
          font-weight: 300;
          max-width: 340px;
          position: relative;
          z-index: 1;
        }
        .p-card--4 .p-card__desc { color: #8a8480; max-width: 440px; }

        .p-card--1::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 56px;
          background: var(--red);
          z-index: 2;
        }

        .p-card__title-inner {
          display: inline-block;
          position: relative;
        }
        .p-card__title-inner::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0; height: 2px;
          background: var(--red);
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .p-card:hover .p-card__title-inner::after { width: 100%; }
        .p-card--4:hover .p-card__title-inner::after { background: rgba(200,55,45,0.7); }

        /* ── FIFTH PILLAR ── */
        .pillars-fifth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
          margin-top: 3px;
        }
        .p-fifth-left {
          background: var(--black);
          padding: 72px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .p-fifth-left::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 3px; height: 72px;
          background: var(--red);
        }
        .p-fifth-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 80px,
            rgba(255,255,255,0.015) 80px,
            rgba(255,255,255,0.015) 81px
          );
          pointer-events: none;
        }
        .p-fifth-left .p-card__num  { color: var(--red); }
        .p-fifth-left .p-card__title { color: #fff; font-size: clamp(28px, 3.2vw, 52px); }
        .p-fifth-left:hover .p-card__title { color: #fff; }
        .p-fifth-left .p-card__desc { color: #7a746e; max-width: 460px; font-size: 15px; }

        .p-fifth-right {
          background: var(--red);
          padding: 72px 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .p-fifth-right::before {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 160px; height: 160px;
          border: 48px solid rgba(255,255,255,0.07);
          border-radius: 50%;
          transform: translate(40px, 40px);
          pointer-events: none;
        }
        .p-fifth-right .p-card__num  { color: rgba(255,255,255,0.5); }
        .p-fifth-right .p-card__title { color: #fff; font-size: clamp(28px, 3.2vw, 52px); }
        .p-fifth-right:hover .p-card__title { color: #fff; }
        .p-fifth-right .p-card__desc { color: rgba(255,255,255,0.7); max-width: 400px; font-size: 15px; }

        .p-fifth-cta {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* ── SCROLL REVEAL ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.06s; }
        [data-reveal][data-d="2"] { transition-delay: 0.14s; }
        [data-reveal][data-d="3"] { transition-delay: 0.22s; }
        [data-reveal][data-d="4"] { transition-delay: 0.32s; }
        [data-reveal][data-d="5"] { transition-delay: 0.42s; }
        [data-reveal][data-d="6"] { transition-delay: 0.54s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1000px) {
          .pillars-inner { padding: 0 48px; }
          .pillars-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .p-card--1 { grid-column: 1 / 3; grid-row: 1; }
          .p-card--2 { grid-column: 1 / 2; grid-row: 2; }
          .p-card--3 { grid-column: 2 / 3; grid-row: 2; }
          .p-card--4 { grid-column: 1 / 3; grid-row: 3; }
          .pillars-fifth { grid-template-columns: 1fr; }
        }
        @media (max-width: 680px) {
          .pillars-inner { padding: 0 24px; }
          .pillars-grid { grid-template-columns: 1fr; }
          .p-card--1,
          .p-card--2,
          .p-card--3,
          .p-card--4 {
            grid-column: 1 / -1;
            grid-row: auto;
          }
          .p-card { padding: 36px 28px; min-height: 280px; }
          .p-fifth-left, .p-fifth-right { padding: 52px 28px; }
        }
      `}</style>

      <section className="pillars" ref={sectionRef}>
        <div className="pillars-inner">

          {/* ── HEADER ── */}
          <div className="pillars-header" data-reveal>
            <span className="pillars-eyebrow">Our DNA</span>

            {/* Line 1 — Anton bold caps: "THE FIVE" */}
            <SplitText
              text="THE FIVE"
              tag="div"
              className="pillars-title pillars-title--sans"
              delay={42}
              duration={1.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="center"
              hoverRoll
              hoverRollDirection="center"
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            />

            {/* Line 2 — Playfair italic: "Pillars" */}
            <SplitText
              text="Pillars"
              tag="div"
              className="pillars-title pillars-title--serif"
              delay={60}
              duration={1.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="center"
              hoverRoll
              hoverRollDirection="center"
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            />
          </div>

          {/* ── BENTO GRID ── */}
          <div className="pillars-grid">

            {/* CARD 1 — Radical Precision */}
            <div className="p-card p-card--1" data-reveal data-d="1">
              <svg className="p-card__deco" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="36" stroke="#c8372d" strokeWidth="1"/>
                <circle cx="60" cy="60" r="4" fill="#c8372d"/>
                <line x1="60" y1="0"  x2="60" y2="20"  stroke="#c8372d" strokeWidth="1"/>
                <line x1="60" y1="100" x2="60" y2="120" stroke="#c8372d" strokeWidth="1"/>
                <line x1="0"  y1="60" x2="20"  y2="60" stroke="#c8372d" strokeWidth="1"/>
                <line x1="100" y1="60" x2="120" y2="60" stroke="#c8372d" strokeWidth="1"/>
                <line x1="60" y1="24" x2="60" y2="40"  stroke="#c8372d" strokeWidth="0.5" strokeDasharray="2 4"/>
                <line x1="60" y1="80" x2="60" y2="96"  stroke="#c8372d" strokeWidth="0.5" strokeDasharray="2 4"/>
                <line x1="24"  y1="60" x2="40" y2="60"  stroke="#c8372d" strokeWidth="0.5" strokeDasharray="2 4"/>
                <line x1="80" y1="60" x2="96" y2="60"  stroke="#c8372d" strokeWidth="0.5" strokeDasharray="2 4"/>
              </svg>
              <span className="p-card__num">01</span>
              <h3 className="p-card__title"><span className="p-card__title-inner">STORY</span></h3>
              <p className="p-card__desc">
               Every project begins with a powerful idea—crafted into a narrative that connects and resonates.
              </p>
            </div>

            {/* CARD 2 — Cinematic Vision */}
            <div className="p-card p-card--2" data-reveal data-d="2">
              <div className="p-card__icon">
                <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="14" cy="14" rx="12" ry="7" stroke="#c8372d" strokeWidth="1.6"/>
                  <circle cx="14" cy="14" r="3.5" fill="#c8372d"/>
                </svg>
              </div>
              <span className="p-card__num">02</span>
              <h3 className="p-card__title"><span className="p-card__title-inner">CREATIVITY</span></h3>
              <p className="p-card__desc">
                Bold thinking and original concepts that bring uniqueness to every frame.
              </p>
            </div>

            {/* CARD 3 — High Velocity */}
            <div className="p-card p-card--3" data-reveal data-d="3">
              <div className="p-card__icon" style={{ top: "40px", left: "44px", right: "auto" }}>
                <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3L6 16h8l-2 9 12-15h-8l2-7z" fill="#c8372d"/>
                </svg>
              </div>
              <span className="p-card__num">03</span>
              <h3 className="p-card__title"><span className="p-card__title-inner">PRECISION</span></h3>
              <p className="p-card__desc">
             Attention to detail at every stage—from planning to final output.
              </p>
            </div>

            {/* CARD 4 — Technological Alchemy */}
            <div className="p-card p-card--4" data-reveal data-d="4">
              <div className="p-card__icon">
                <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2l10.39 6v12L14 26 3.61 20V8L14 2z" stroke="#c8372d" strokeWidth="1.5"/>
                  <path d="M14 8l5.2 3v6L14 20l-5.2-3V11L14 8z" stroke="#c8372d" strokeWidth="1" strokeDasharray="2 2"/>
                  <circle cx="14" cy="14" r="2" fill="#c8372d"/>
                </svg>
              </div>
              <span className="p-card__num">04</span>
              <h3 className="p-card__title"><span className="p-card__title-inner">TECHNOLOGY</span></h3>
              <p className="p-card__desc">
               Leveraging cutting-edge tools, including AI, to enhance storytelling and production.
              </p>
            </div>

          </div>

          {/* ── FIFTH PILLAR ── */}
          <div className="pillars-fifth">

            <div className="p-fifth-left" data-reveal data-d="5">
              <span className="p-card__num">05</span>
              <h3 className="p-card__title" style={{ position: "relative", zIndex: 1 }}>
                <span className="p-card__title-inner">IMPACT</span>
              </h3>
              <p className="p-card__desc" style={{ position: "relative", zIndex: 1, marginTop: "14px" }}>
                Creating visuals that don’t just look good—but leave a lasting impression.
              </p>
            </div>

            <div className="p-fifth-right" data-reveal data-d="6">
              <div>
                <span className="p-card__num">Our Approach</span>
                <h3 className="p-card__title" style={{ position: "relative", zIndex: 1 }}>
                  <span className="p-card__title-inner">Ready to Engineer<br />Your Moment?</span>
                </h3>
                <p className="p-card__desc" style={{ position: "relative", zIndex: 1, marginTop: "14px" }}>
                  We accept a limited number of new partners each quarter. Two slots
                  remain open for Q3 2025.
                </p>
              </div>
              <div className="p-fifth-cta" style={{ position: "relative", zIndex: 1 }}>
                <RollButton label="Start a Project" href="/contact" />
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}