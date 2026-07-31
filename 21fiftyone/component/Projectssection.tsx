"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";

gsap.registerPlugin(ScrollTrigger);

/* ─── PROJECT DATA ─── */
const PROJECTS = [
  {
    id: 1,
    num: "01",
    client: " devotional music",
    title: " kallazhimusic",
    category: "AI Campaign ",
    year: "2025",
    desc: "A campaign that dissolves the boundary between couture and computation. Every frame engineered to feel inevitable.",
    video: "/videos/projects/Latest Ayyappa devotional _ ഏറ്റവും പുതിയ അയ്യപ്പഭക്തിഗാനം _ ചിന്മുദ്രാംഗി _ Chinmundranki _.mp4",
    tag: "Film",
  },
  {
    id: 2,
    num: "02",
    client: "Fr Binoj ",
    title: "Mulavarickal Official",
    category: "Editorial · Print",
    year: "2024",
    desc: "An editorial series that makes stillness speak. Analogue soul, digital precision — the paradox that defines luxury.",
    video: "/videos/projects/Neramayi Kaalamayi _ Fr. Binoj Mulavarickal _ Jmymah & Gichu Joy _ Christmas Song 2025.mp4",
    tag: "Editorial",
  },
  {
    id: 3,
    num: "03",
    client: "content creation",
    title: "indel suzuki",
    category: "CGI · Motion",
    year: "2023",
    desc: "We turned a century of craft into a 60-second visual poem. The bottle never appeared once.",
    video: "/videos/projects/video-3.webm",
    tag: "CGI",
  },
];

/* ─── helper: set active index ─── */
function setActiveIndex(index: number) {
  // Update meta panels
  PROJECTS.forEach((p, i) => {
    const el = document.getElementById(`proj-meta-${p.id}`);
    if (el) {
      el.classList.toggle("active", i === index);
    }
  });

  // Update progress dots
  PROJECTS.forEach((p, i) => {
    const dot = document.getElementById(`proj-dot-${p.id}`);
    if (dot) {
      dot.classList.toggle("active", i === index);
    }
  });
}

/* ─── STICKY PROJECTS SECTION ─── */
export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal for non-heading elements
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

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      const total = cards.length;

      // Set initial states
      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < total; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      }

      // Initialise first meta + dot as active
      setActiveIndex(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".proj-sticky-stage",
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.6,
          pinSpacing: true,
          // ── sync content on each scroll update ──
          onUpdate: (self) => {
            // progress goes 0 → 1 across (total - 1) transitions
            const rawIndex = self.progress * (total - 1);
            // The "active" card is whichever one has slid >= 50% into view
            const activeIndex = Math.min(Math.round(rawIndex), total - 1);
            setActiveIndex(activeIndex);
          },
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const cur  = cards[i];
        const next = cards[i + 1];

        // current card: scale down + slight rotation
        tl.to(cur, { scale: 0.88, rotation: 3, opacity: 0.5, duration: 1, ease: "none" }, i);
        // next card: slide up from below
        tl.to(next, { y: "0%", duration: 1, ease: "none" }, i);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      if (containerRef.current) ro.observe(containerRef.current);

      return () => {
        ro.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <ReactLenis root>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        /* ─── SECTION ─── */
        .proj-section {
          width: 100%;
          background: var(--cream);
          overflow: visible;
          position: relative;
        }

        /* ─── HEADER ─── */
        .proj-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 120px 80px 80px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          overflow: visible;
        }
        .proj-header-left { overflow: visible; }

        .proj-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--red);
          display: block;
          margin-bottom: 16px;
        }

        /* Heading — same Hero2 treatment */
        .proj-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(52px, 7vw, 104px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.01em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-right: 6px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }
        .proj-title > div {
          overflow: visible !important;
        }
        .proj-title [data-roll-unit] { overflow: hidden; }

        .proj-title-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(24px, 2.8vw, 48px) !important;
          color: var(--red) !important;
          line-height: 0.95 !important;
          letter-spacing: -0.01em !important;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-right: 6px !important;
          margin-top: -0.04em;
        }
        .proj-title-accent > div {
          overflow: visible !important;
        }
        .proj-title-accent [data-roll-unit] { overflow: hidden; }

        .proj-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 20px;
          padding-bottom: 10px;
          flex-shrink: 0;
        }
        .proj-count {
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .proj-count span {
          color: var(--red);
          font-size: 18px;
        }

        /* ─── STICKY STAGE ─── */
        .proj-sticky-wrap {
          width: 100%;
        }
        .proj-sticky-stage {
          width: 100%;
          height: 100vh;
          background: var(--black);
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          position: relative;
        }

        /* Left info panel */
        .proj-info-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 64px 56px 64px 80px;
          position: relative;
          z-index: 10;
          pointer-events: none;
        }

        /* Project meta — shown via active class */
        .proj-card-meta {
          position: absolute;
          inset: 0;
          padding: 64px 56px 64px 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          opacity: 0;
          /* smooth cross-fade when active index changes */
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .proj-card-meta.active {
          opacity: 1;
          pointer-events: auto;
        }

        .proj-client {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .proj-client::before {
          content: '';
          width: 24px; height: 1px;
          background: var(--red);
          display: inline-block;
        }

        .proj-card-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 4.5vw, 68px);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 24px;
          white-space: pre-line;
        }

        .proj-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          max-width: 360px;
          margin-bottom: 32px;
        }

        .proj-card-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .proj-tag {
          border: 1px solid rgba(255,255,255,0.12);
          padding: 6px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .proj-tag.red { border-color: var(--red); color: var(--red); }

        .proj-card-cta { pointer-events: auto; }

        /* Right video stack */
        .proj-video-col {
          position: relative;
          overflow: hidden;
        }

        .proj-card {
          position: absolute;
          inset: 0;
          will-change: transform, opacity;
        }

        .proj-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* gradient overlay on video */
        .proj-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(12,12,12,0.92) 0%,
            rgba(12,12,12,0.3) 60%,
            rgba(12,12,12,0.1) 100%
          );
          pointer-events: none;
        }

        /* thin red top border on first card */
        .proj-card:first-child::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--red);
          z-index: 2;
        }

        /* card number badge */
        .proj-card-badge {
          position: absolute;
          top: 40px;
          right: 40px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .proj-card-badge-num {
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.3);
        }
        .proj-card-badge-year {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        /* progress dots */
        .proj-progress {
          position: absolute;
          right: 40px;
          bottom: 40px;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .proj-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: background 0.3s, transform 0.3s;
        }
        .proj-dot.active {
          background: var(--red);
          transform: scale(1.4);
        }

        /* ─── REVEAL ─── */
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
        [data-reveal][data-d="5"] { transition-delay: 0.42s; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1000px) {
          .proj-header { padding: 80px 48px 60px; }
          .proj-sticky-stage { grid-template-columns: 1fr; }
          .proj-info-col { padding: 40px 32px; justify-content: flex-end; }
          .proj-card-meta { padding: 40px 32px; }
        }
        @media (max-width: 640px) {
          .proj-header { padding: 60px 28px 48px; flex-direction: column; align-items: flex-start; }
          .proj-header-right { align-items: flex-start; }
          .proj-sticky-stage { height: 100svh; }
          .proj-info-col { padding: 28px 24px; }
          .proj-card-meta { padding: 28px 24px; }
        }
      `}</style>

      <section className="proj-section" ref={sectionRef}>

        {/* ── HEADER ── */}
        <div className="proj-header" ref={headerRef}>
          <div className="proj-header-left">
            <span className="proj-eyebrow" data-reveal>Selected Work</span>

            <SplitText
              text="Our Best"
              tag="div"
              className="proj-title"
              delay={40}
              duration={1.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 70 }}
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
              text="PROJECTS"
              tag="div"
              className="proj-title-accent"
              delay={32}
              duration={1.4}
              ease="power4.out"
              splitType="chars"
              from={{ opacity: 0, y: 80, skewX: 6 }}
              to={{ opacity: 1, y: 0, skewX: 0 }}
              threshold={0.05}
              rootMargin="-20px"
              textAlign="left"
              hoverRoll
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
              hoverRollDirection="left"
            />
          </div>

          <div className="proj-header-right" data-reveal data-d="2">
            <p className="proj-count">
              <span>{PROJECTS.length.toString().padStart(2, "0")}</span> Projects
            </p>
            <RollButton label="All Work" href="/studio" />
          </div>
        </div>

        {/* ── STICKY SCROLL STAGE ── */}
        <div className="proj-sticky-wrap" ref={containerRef}>
          <div className="proj-sticky-stage">

            {/* Left: meta panels (one per project, toggled via setActiveIndex) */}
            <div className="proj-info-col">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className={`proj-card-meta${i === 0 ? " active" : ""}`}
                  id={`proj-meta-${p.id}`}
                >
                  <p className="proj-client">{p.client}</p>
                  <h3 className="proj-card-title">{p.title}</h3>
                  <p className="proj-card-desc">{p.desc}</p>
                  <div className="proj-card-tags">
                    <span className="proj-tag red">{p.tag}</span>
                    <span className="proj-tag">{p.category}</span>
                    <span className="proj-tag">{p.year}</span>
                  </div>
                  {/* ── "View" instead of "View Case" ── */}
                  <div className="proj-card-cta">
                    <RollButton label="View" href={`/studio`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: stacked video cards */}
            <div className="proj-video-col">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className="proj-card"
                  ref={(el) => { cardRefs.current[i] = el; }}
                >
                  {/* Badge */}
                  <div className="proj-card-badge">
                    <span className="proj-card-badge-num">{p.num}</span>
                    <span className="proj-card-badge-year">{p.year}</span>
                  </div>

                  <video
                    src={p.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              ))}

              {/* Progress dots */}
              <div className="proj-progress">
                {PROJECTS.map((p, i) => (
                  <div
                    key={p.id}
                    className={`proj-dot${i === 0 ? " active" : ""}`}
                    id={`proj-dot-${p.id}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>
    </ReactLenis>
  );
}