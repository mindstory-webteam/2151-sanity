"use client";

import Link from "next/link";
import SplitText from "./Splittext";

export default function BreakTheMold() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400;600;700&display=swap');

        .btm-bleed {
          position: relative;
          width: 100vw;
          left: 50%;
          transform: translateX(-50%);
          overflow-x: clip;
        }

        .btm-section {
          width: 100vw;
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin-left: calc(50% - 50vw);
        }

        /* ══ GLOW ══ */
        .btm-glow {
          position: absolute; inset: 0; z-index: 1;
          background: radial-gradient(ellipse 70% 60% at 40% 55%, rgba(212,43,43,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ══ RULES ══ */
        .btm-top-rule, .btm-bottom-rule {
          position: absolute; left: 0; right: 0; height: 1px; z-index: 2;
          background: linear-gradient(to right,
            transparent 0%, rgba(255,255,255,0.08) 20%,
            rgba(255,255,255,0.08) 80%, transparent 100%
          );
        }
        .btm-top-rule    { top: 0; }
        .btm-bottom-rule { bottom: 0; }

        /* ══ CORNERS ══ */
        .btm-corner {
          position: absolute; width: 20px; height: 20px;
          pointer-events: none; opacity: 0.32; z-index: 2;
        }
        .btm-corner.tl { top: 24px;    left: 40px;  border-top: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.tr { top: 24px;    right: 40px; border-top: 1px solid #fff; border-right: 1px solid #fff; }
        .btm-corner.bl { bottom: 24px; left: 40px;  border-bottom: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.br { bottom: 24px; right: 40px; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }

        /* ══ META ══ */
        .btm-meta-left {
          position: absolute; bottom: 32px; left: 52px; z-index: 3;
          display: flex; align-items: center; gap: 10px;
          opacity: 0.28; pointer-events: none;
        }
        .btm-meta-left-line { width: 22px; height: 1px; background: #fff; flex-shrink: 0; }
        .btm-meta-right {
          position: absolute; bottom: 32px; right: 52px; z-index: 3;
          opacity: 0.2; pointer-events: none;
        }
        .btm-meta-text {
          font-family: 'Barlow', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.32em; color: #fff; text-transform: uppercase;
        }

        /* ══ GHOST NUMBER ══ */
        .btm-bg-num {
          position: absolute; right: -20px; bottom: -50px; z-index: 1;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(180px, 26vw, 320px); font-weight: 900;
          color: rgba(255,255,255,0.025); line-height: 1;
          letter-spacing: -0.05em; pointer-events: none; user-select: none;
        }

        /* ══ CONTENT ══ */
        .btm-content {
          position: relative; z-index: 4;
          width: 100%; max-width: 800px;
          padding: 0 40px; text-align: center;
        }

        /* ── Eyebrow ── */
        .btm-eyebrow {
          display: inline-flex; align-items: center; gap: 14px; margin-bottom: 32px;
        }
        .btm-eyebrow-bar  { width: 28px; height: 1px; background: rgba(212,43,43,0.8); flex-shrink: 0; }
        .btm-eyebrow-label {
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.36em; color: #d42b2b; text-transform: uppercase;
        }

        /* ── Headlines ── */
        .btm-headline-wrap { margin: 0 0 28px; line-height: 0.88; }
        .btm-split-solid {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(52px, 9.5vw, 112px) !important;
          text-transform: uppercase !important; line-height: 0.88 !important;
          letter-spacing: -0.02em !important; color: #ffffff !important;
          display: flex !important; justify-content: center !important;
        }
        .btm-split-outline {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(52px, 9.5vw, 112px) !important;
          text-transform: uppercase !important; line-height: 0.88 !important;
          letter-spacing: -0.02em !important; color: transparent !important;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.2) !important;
          display: flex !important; justify-content: center !important;
          margin-top: 6px !important;
        }

        /* ── Sub ── */
        .btm-sub {
          font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 400;
          line-height: 1.85; color: rgba(255,255,255,0.4);
          max-width: 440px; margin: 0 auto 44px;
        }

        /* ── CTAs ── */
        .btm-ctas {
          display: flex; align-items: center; justify-content: center; gap: 18px;
        }

        .btm-btn-primary {
          display: inline-flex; align-items: center; gap: 14px;
          background: #d42b2b; color: #fff;
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase; text-decoration: none;
          padding: 16px 30px; border-radius: 2px; border: none; cursor: pointer;
          transition: background 0.25s, gap 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
        }
        .btm-btn-primary:hover {
          background: #bf2020; gap: 22px;
          box-shadow: 0 0 32px rgba(212,43,43,0.45);
        }
        .btm-btn-primary svg { flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .btm-btn-primary:hover svg { transform: translateX(5px); }

        .btm-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          background: none; color: rgba(255,255,255,0.5);
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none; padding: 16px 0;
          border: none; cursor: pointer; transition: color 0.22s ease;
          position: relative;
        }
        .btm-btn-ghost::after {
          content: ''; position: absolute; bottom: 12px; left: 0; right: 0;
          height: 1px; background: rgba(255,255,255,0.25);
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .btm-btn-ghost:hover { color: rgba(255,255,255,0.9); }
        .btm-btn-ghost:hover::after { transform: scaleX(1); }

        @media (max-width: 768px) {
          .btm-content { padding: 0 24px; }
          .btm-ctas    { flex-direction: column; gap: 10px; }
          .btm-corner, .btm-meta-left, .btm-meta-right { display: none; }
        }
      `}</style>

      <div className="btm-bleed">
        <div className="btm-section">

          <div className="btm-glow" />
          <div className="btm-bg-num">1</div>
          <div className="btm-top-rule" />
          <div className="btm-bottom-rule" />

          <div className="btm-corner tl" />
          <div className="btm-corner tr" />
          <div className="btm-corner bl" />
          <div className="btm-corner br" />

          <div className="btm-meta-left">
            <div className="btm-meta-left-line" />
            <span className="btm-meta-text">Studio 2025</span>
          </div>
          <div className="btm-meta-right">
            <span className="btm-meta-text">Based Worldwide</span>
          </div>

          <div className="btm-content">
            <div className="btm-eyebrow">
              <div className="btm-eyebrow-bar" />
              <span className="btm-eyebrow-label">Let&apos;s Create Together</span>
              <div className="btm-eyebrow-bar" />
            </div>

            <div className="btm-headline-wrap">
              <SplitText
                text="READY TO BREAK"
                className="btm-split-solid"
                splitType="chars"
                delay={30}
                duration={1.1}
                ease="power3.out"
                from={{ opacity: 0, y: 48, skewX: -6 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.2}
                rootMargin="-40px"
                textAlign="center"
                hoverRoll
                hoverRollDirection="center"
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
              />
              <SplitText
                text="THE MOLD?"
                className="btm-split-outline"
                splitType="words"
                delay={120}
                duration={1.2}
                ease="power4.out"
                from={{ opacity: 0, y: 64, skewX: 8 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.2}
                rootMargin="-40px"
                textAlign="center"
                hoverRoll
                hoverRollDirection="left"
              />
            </div>

            <p className="btm-sub">
              Let&apos;s collaborate on your next masterpiece.{" "}
              Our studio doors are always open for the brave.
            </p>

            <div className="btm-ctas">
              <Link href="/contact">
                <button type="button" className="btm-btn-primary">
                  Connect With The Studio
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path
                      d="M1 5H13M9 1L13 5L9 9"
                      stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
              <Link href="/studio">
                <button type="button" className="btm-btn-ghost">View Our Work</button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}