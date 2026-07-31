"use client";

import { useEffect, useRef, useState } from "react";
import SplitText from "./Splittext";

const projects = [
  {
    id: 1,
    name: "indel suzuki ",
    category: "content creation",
    year: "2025",
    tags: ["Brand Experience", "Digital"],
    video: "/videos/projects/video-3.webm",
    poster: "",
  },
  {
    id: 2,
    name: "Fr Binoj Mulavarickal ",
    category: "Officia music",
    year: "2025",
    tags: ["Brand Experience", "Digital"],
    video: "/videos/projects/Neramayi Kaalamayi _ Fr. Binoj Mulavarickal _ Jmymah & Gichu Joy _ Christmas Song 2025.mp4",
    poster: "",
  },
  {
    id: 3,
    name: "kallazhimusic ",
    category: "devotional music",
    year: "2024",
    tags: ["Interactive", "Luxury"],
    video: "/videos/projects/Latest Ayyappa devotional _ ഏറ്റവും പുതിയ അയ്യപ്പഭക്തിഗാനം _ ചിന്മുദ്രാംഗി _ Chinmundranki _.mp4",
    poster: "",
  },
] as const;

const TOTAL = projects.length;

function VideoPanel({ video, poster, active }: { video: string; poster: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <video
      ref={ref}
      src={video}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

export default function ProjectsScroll() {
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const scrolled = -rect.top;
        const total = rect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));
        const nextIndex = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
        setCurrent(prev => (prev !== nextIndex ? nextIndex : prev));
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSlide = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollTarget = absoluteTop + (idx / TOTAL) * (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  const displayIndex = hoveredIndex !== null && hoveredIndex !== current ? hoveredIndex : current;
  const slide = projects[displayIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

        .ps-root, .ps-root *, .ps-root *::before, .ps-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .ps-root {
          width: 100%;
          background: #f8f7f5;
          font-family: 'Barlow', sans-serif;
        }

        .ps-heading-block {
          width: 100%;
          padding: 100px 60px 0;
          background: #f8f7f5;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ps-heading-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.44em;
          text-transform: uppercase;
          color: #d42b2b;
          margin-bottom: 28px;
        }
        .ps-heading-eyebrow::before,
        .ps-heading-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #d42b2b;
          flex-shrink: 0;
        }

        .ps-heading-divider {
          width: 100%;
          height: 1px;
          background: rgba(13,13,13,0.09);
          margin-top: 48px;
        }

        .ps-split-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          width: 100%;
        }

        .ps-split-line {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(5rem, 13vw, 16rem);
          line-height: 0.9;
          letter-spacing: -0.035em;
          text-transform: uppercase;
          color: #0d0d0d;
          white-space: nowrap;
          display: flex;
          justify-content: center;
        }

        .ps-split-accent {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(2.8rem, 8vw, 9rem);
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: rgba(13, 13, 13, 0.12);
          white-space: nowrap;
          display: flex;
          justify-content: center;
        }

        .ps-scroll-section {
          position: relative;
          height: ${TOTAL * 100}vh;
          width: 100%;
        }
        .ps-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 500px;
          overflow: hidden;
        }

        .ps-video-panel {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0d0d0d;
          overflow: hidden;
        }
        .ps-video-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.75s cubic-bezier(0.23,1,0.32,1);
          will-change: opacity;
        }
        .ps-video-slide.ps-vid-on { opacity: 1; }
        .ps-video-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, transparent 50%, rgba(248,247,245,0.05) 100%),
            linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, transparent 30%,
              transparent 60%, rgba(13,13,13,0.65) 100%);
          z-index: 2;
          pointer-events: none;
        }
        .ps-video-info {
          position: absolute;
          bottom: 56px;
          left: 56px;
          z-index: 10;
          pointer-events: none;
        }
        .ps-vi-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #d42b2b;
          margin-bottom: 12px;
        }
        .ps-vi-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #d42b2b;
          flex-shrink: 0;
        }
        .ps-vi-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(4rem, 8vw, 9rem);
          line-height: 0.84;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          white-space: pre-line;
          color: #f8f7f5;
          text-shadow: 0 4px 60px rgba(0,0,0,0.5);
        }
        .ps-vi-tags {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .ps-vi-tag {
          font-family: 'Barlow', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(248,247,245,0.6);
          border: 1px solid rgba(248,247,245,0.22);
          padding: 5px 12px;
          border-radius: 20px;
        }

        .ps-list-panel {
          position: relative;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #f8f7f5;
          overflow: hidden;
        }

        .ps-list-label {
          position: absolute;
          top: 44px;
          left: 52px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #d42b2b;
          z-index: 5;
        }
        .ps-list-label::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #d42b2b;
        }

        .ps-list-panel::before,
        .ps-list-panel::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 120px;
          z-index: 4;
          pointer-events: none;
        }
        .ps-list-panel::before {
          top: 0;
          background: linear-gradient(to bottom, #f8f7f5 0%, transparent 100%);
        }
        .ps-list-panel::after {
          bottom: 0;
          background: linear-gradient(to top, #f8f7f5 0%, transparent 100%);
        }

        .ps-list-full {
          height: 100%;
          overflow-y: auto;
          padding: 100px 56px 80px 52px;
        }
        .ps-list-full::-webkit-scrollbar { width: 4px; }
        .ps-list-full::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

        .ps-item {
          position: relative;
          height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-bottom: 1px solid rgba(13,13,13,0.08);
          cursor: pointer;
          transition: padding-left 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease;
          opacity: 0.28;
          will-change: transform, opacity;
        }
        .ps-item:first-child { border-top: 1px solid rgba(13,13,13,0.08); }
        .ps-item.ps-on { opacity: 1; padding-left: 20px; }
        .ps-item:hover { opacity: 0.7; }
        .ps-item.ps-on:hover { opacity: 1; }
        .ps-item.ps-on::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 56%;
          background: #d42b2b;
          border-radius: 2px;
        }

        .ps-item-row { display: flex; align-items: center; gap: 16px; }
        .ps-num {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
          color: #cccccc; min-width: 26px; flex-shrink: 0; transition: color 0.3s;
        }
        .ps-item.ps-on .ps-num { color: #d42b2b; }
        .ps-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic; font-weight: 900;
          font-size: clamp(1.5rem, 2.9vw, 2.6rem);
          line-height: 0.88; letter-spacing: -0.02em;
          text-transform: uppercase; white-space: pre-line;
          color: #0d0d0d; flex: 1;
        }
        .ps-year {
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.12em;
          color: #aaaaaa; flex-shrink: 0; transition: color 0.3s;
        }
        .ps-item.ps-on .ps-year { color: #666; }

        .ps-meta {
          display: flex; align-items: center; gap: 10px;
          margin-top: 8px; padding-left: 42px; flex-wrap: wrap;
        }
        .ps-cat {
          font-family: 'Barlow', sans-serif;
          font-size: 8px; font-weight: 600; letter-spacing: 0.3em;
          text-transform: uppercase; color: #d42b2b; white-space: nowrap;
        }
        .ps-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(13,13,13,0.18); flex-shrink: 0; }
        .ps-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .ps-tag {
          font-family: 'Barlow', sans-serif;
          font-size: 7.5px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: #888888;
          border: 1px solid rgba(13,13,13,0.12);
          padding: 3px 10px; border-radius: 20px; white-space: nowrap;
        }

        .ps-dots {
          position: absolute; right: 20px; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 9px; z-index: 10;
        }
        .ps-dot {
          width: 2px; height: 16px; border-radius: 2px;
          background: rgba(13,13,13,0.10); cursor: pointer;
          transition: height 0.35s ease, background 0.35s ease;
        }
        .ps-dot.ps-on { height: 38px; background: #d42b2b; }

        .ps-counter {
          position: absolute; bottom: 32px; right: 56px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.22em;
          color: #bbbbbb; z-index: 10;
        }
        .ps-counter strong { color: #0d0d0d; font-weight: 600; }

        .ps-progress {
          position: absolute; bottom: 0; left: 0;
          height: 2px; background: #d42b2b;
          transition: width 0.5s cubic-bezier(0.23,1,0.32,1); z-index: 10;
        }

        .ps-hint {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          pointer-events: none; transition: opacity 0.4s; z-index: 10;
        }
        .ps-hint-label {
          font-family: 'Barlow', sans-serif;
          font-size: 7.5px; font-weight: 600; letter-spacing: 0.38em;
          text-transform: uppercase; color: #bbbbbb;
        }
        .ps-hint-line {
          width: 1px; height: 34px; background: #dddddd;
          position: relative; overflow: hidden;
        }
        .ps-hint-line::after {
          content: ''; position: absolute;
          top: -100%; left: 0; width: 100%; height: 100%;
          background: #d42b2b;
          animation: ps-drop 1.5s ease-in-out infinite;
        }
        @keyframes ps-drop { 0% { top: -100%; } 100% { top: 100%; } }

        @media (max-width: 900px) {
          .ps-sticky { grid-template-columns: 1fr; }
          .ps-list-panel { display: none; }
          .ps-heading-block { padding: 80px 28px 0; }
        }
      `}</style>

      <div className="ps-root">

        {/* ── BIG HEADING ── */}
        <div className="ps-heading-block">
          <p className="ps-heading-eyebrow">21fiftyone Studio</p>

          <div className="ps-split-wrapper">
            <div className="ps-split-line">
              <SplitText
                text="Selected"
                splitType="chars"
                from={{ opacity: 0, y: 80, skewX: 6 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                delay={40}
                duration={1.2}
                ease="power3.out"
                threshold={0.15}
                rootMargin="-80px"
                hoverRoll
                hoverRollDirection="left"
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
              />
            </div>

            <div className="ps-split-accent">
              <SplitText
                text="Works "
                splitType="words"
                from={{ opacity: 0, y: 100 }}
                to={{ opacity: 1, y: 0 }}
                delay={120}
                duration={1.3}
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

          <div className="ps-heading-divider" />
        </div>

        {/* ── SCROLL SECTION ── */}
        <div className="ps-scroll-section" ref={containerRef}>
          <div className="ps-sticky">

            {/* LEFT: Video */}
            <div className="ps-video-panel">
              {projects.map((p, i) => (
                <div key={i} className={`ps-video-slide${i === displayIndex ? " ps-vid-on" : ""}`}>
                  <VideoPanel video={p.video} poster={p.poster} active={i === displayIndex} />
                </div>
              ))}
              <div className="ps-video-overlay" />
              <div className="ps-video-info">
                <p className="ps-vi-eyebrow">{slide.category}</p>
                <h2 className="ps-vi-title">
                  {slide.name.split("\n").map((line, index) => (
                    <div key={index}>
                      <SplitText
                        text={line}
                        splitType="chars"
                        from={{ opacity: 0, y: 80, skewX: 6 }}
                        to={{ opacity: 1, y: 0, skewX: 0 }}
                        delay={index * 120}
                        duration={1.2}
                        ease="power3.out"
                        threshold={0.2}
                        rootMargin="-50px"
                      />
                    </div>
                  ))}
                </h2>
                <div className="ps-vi-tags">
                  {slide.tags.map(t => <span key={t} className="ps-vi-tag">{t}</span>)}
                </div>
              </div>
            </div>

            {/* RIGHT: List */}
            <div className="ps-list-panel">
              <p className="ps-list-label">Selected Work</p>

              <div className="ps-list-full">
                {projects.map((p, i) => {
                  const isOn = current === i || hoveredIndex === i;
                  return (
                    <div
                      key={i}
                      ref={el => { itemRefs.current[i] = el; }}
                      className={`ps-item${isOn ? " ps-on" : ""}`}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => scrollToSlide(i)}
                    >
                      <div className="ps-item-row">
                        <span className="ps-num">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="ps-name">{p.name}</h3>
                        <span className="ps-year">{p.year}</span>
                      </div>
                      <div className="ps-meta">
                        <span className="ps-cat">{p.category}</span>
                        <span className="ps-sep" />
                        <div className="ps-tags">
                          {p.tags.map(t => <span key={t} className="ps-tag">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ps-dots">
                {projects.map((_, i) => (
                  <div key={i} className={`ps-dot${i === current ? " ps-on" : ""}`} onClick={() => scrollToSlide(i)} />
                ))}
              </div>

              <div className="ps-counter">
                <strong>{String(current + 1).padStart(2, "0")}</strong> / {String(TOTAL).padStart(2, "0")}
              </div>

              <div className="ps-progress" style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />

              <div className="ps-hint" style={{ opacity: current === 0 ? 1 : 0 }}>
                <span className="ps-hint-label">Scroll</span>
                <div className="ps-hint-line" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}