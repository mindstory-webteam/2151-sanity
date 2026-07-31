"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";

export default function Hero2() {
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
      { threshold: 0.12 }
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

        /* ─── SECTION ─── */
        .hero2 {
          width: 100%;
          background: var(--cream);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          /* FIX: was overflow:hidden — that clips descenders & edge chars */
          overflow: visible;
          position: relative;
        }

        /* ─── TOP BAR ─── */
        .hero2-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 64px;
          z-index: 10;
        }
        .hero2-studio-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
        }
        .hero2-year-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* Add breathing space inside each rolling character */
.hero2-line-1 [data-roll-unit],
.hero2-line-accent [data-roll-unit],
.hero2-line-2 [data-roll-unit] {
  padding: 0 0.08em;   /* 👈 controls horizontal space */
  margin: 0 -0.02em;   /* 👈 keeps visual alignment tight */
}

.hero2-line-1 [data-roll-unit],
.hero2-line-accent [data-roll-unit],
.hero2-line-2 [data-roll-unit] {
  padding-top: 0.08em;
  padding-bottom: 0.08em;
}
  .hero2-line-1,
.hero2-line-accent,
.hero2-line-2 {
  letter-spacing: 0.01em; /* very subtle */
}

        /* ─── INNER WRAPPER ─── */
        .hero2-inner {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          /* Extra left padding so glyphs never touch the viewport edge.
             The negative margin on each headline line offsets the visual shift. */
          padding: 0 80px 0 80px;
          padding-top: 160px;
          padding-bottom: 0;
          position: relative;
          overflow: visible;
          box-sizing: border-box;
        }

        /* ─── HEADLINE LINES ─── */

        /* "WE ARE THE" */
        .hero2-line-1 {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(64px, 10vw, 152px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.01em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          /* compensate for Anton's optical left overhang */
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-top: 12px !important;
          padding-bottom: 4px !important;
        }

        /* "Alchemists" – italic red */
        .hero2-line-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(52px, 8.5vw, 132px) !important;
          color: var(--red) !important;
          line-height: 0.95 !important;
          letter-spacing: -0.01em !important;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }

        /* "OF DIGITAL NOIR." */
        .hero2-line-2 {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(64px, 10vw, 152px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.01em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          padding-top: 4px !important;
          padding-bottom: 12px !important;
        }

        /* SplitText flex wrapper — must not clip */
        .hero2-line-1 > div,
        .hero2-line-accent > div,
        .hero2-line-2 > div {
          overflow: visible !important;
        }

        /* SplitText roll-unit: clip only the roll animation */
        .hero2-line-1 [data-roll-unit],
        .hero2-line-accent [data-roll-unit],
        .hero2-line-2 [data-roll-unit] {
          overflow: hidden;
        }

        /* ─── LOWER: image left + text right ─── */
        .hero2-lower {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 0;
          /* FIX: increased top margin so headline descenders don't overlap */
          margin-top: 72px;
          align-items: stretch;
          border-top: 1px solid var(--line);
        }

        /* Image pane */
        .hero2-image-pane {
          position: relative;
          overflow: hidden;
          min-height: 480px;
        }
        .hero2-image-pane img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(20%);
          transition: filter 0.8s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .hero2-image-pane:hover img {
          filter: grayscale(0%);
          transform: scale(1.04);
        }
        .hero2-image-pane::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 3px; height: 64px;
          background: var(--red);
        }
        .hero2-img-caption {
          position: absolute;
          bottom: 20px; left: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          z-index: 2;
        }

        /* Text pane */
        .hero2-text-pane {
          padding: 56px 64px 56px 72px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 40px;
          background: var(--cream);
        }

        .hero2-origin-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .hero2-origin-label::after {
          content: '';
          display: inline-block;
          width: 28px; height: 1px;
          background: var(--red);
        }

        .hero2-sub-heading {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .hero2-paragraph {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.85;
          color: #3a3735;
          font-weight: 300;
          margin-bottom: 16px;
        }

        /* Quote block */
        .hero2-quote-block {
          padding: 32px 36px;
          background: #eae4db;
          position: relative;
          margin-top: 4px;
        }
        .hero2-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 110px;
          color: var(--red);
          opacity: 0.15;
          position: absolute;
          top: -12px; left: 20px;
          line-height: 1;
          pointer-events: none;
        }
        .hero2-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 19px;
          line-height: 1.55;
          color: var(--black);
          position: relative;
          z-index: 1;
        }
        .hero2-quote-block cite {
          font-family: 'DM Sans', sans-serif;
          font-style: normal;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 18px;
          display: block;
        }

        /* Stats */
        .hero2-stats {
          display: flex;
          gap: 48px;
          padding-top: 28px;
          border-top: 1px solid var(--line);
          margin-top: auto;
        }
        .hero2-stat-num {
          font-family: 'Anton', sans-serif;
          font-size: 40px;
          line-height: 1;
          color: var(--black);
          display: block;
        }
        .hero2-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 6px;
          display: block;
        }

        /* CTA row */
        .hero2-cta-row {
          display: flex;
          align-items: center;
          gap: 32px;
          padding-top: 8px;
        }
        .hero2-scroll-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hero2-scroll-hint::before {
          content: '';
          display: inline-block;
          width: 1px; height: 40px;
          background: var(--muted);
          opacity: 0.4;
        }

        /* ─── REVEAL ─── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.3s; }
        [data-reveal][data-d="4"] { transition-delay: 0.44s; }
        [data-reveal][data-d="5"] { transition-delay: 0.58s; }
        [data-reveal][data-d="6"] { transition-delay: 0.72s; }

        .hero2-image-pane[data-reveal] { transform: translateY(40px) scale(0.97); }
        .hero2-image-pane[data-reveal].revealed { transform: translateY(0) scale(1); }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1100px) {
          .hero2-inner { padding: 0 56px; padding-top: 140px; }
          .hero2-lower { grid-template-columns: 320px 1fr; }
          .hero2-text-pane { padding: 40px 40px 40px 48px; }
        }
        @media (max-width: 800px) {
          .hero2-inner { padding: 0 40px; padding-top: 120px; }
          .hero2-top-bar { padding: 24px 40px; }
          .hero2-lower { grid-template-columns: 1fr; margin-top: 48px; }
          .hero2-image-pane { min-height: 300px; }
          .hero2-text-pane { padding: 40px 32px; }
          .hero2-stats { gap: 32px; }
          .hero2-line-1,
          .hero2-line-2  { font-size: clamp(52px, 13vw, 120px) !important; }
          .hero2-line-accent { font-size: clamp(44px, 11vw, 100px) !important; }
        }
        @media (max-width: 500px) {
          .hero2-inner { padding: 0 28px; padding-top: 100px; }
          .hero2-top-bar { padding: 20px 28px; }
          .hero2-line-1,
          .hero2-line-2  { font-size: clamp(36px, 13vw, 72px) !important; }
          .hero2-line-accent { font-size: clamp(30px, 11vw, 60px) !important; }
          .hero2-text-pane { padding: 36px 24px; }
        }
      `}</style>

      <section className="hero2" ref={sectionRef}>

        {/* Top label bar */}
        <div className="hero2-top-bar">
          <span className="hero2-studio-label">21FiftyOne Studio</span>
          <span className="hero2-year-label">21FIFTYONE</span>
        </div>

        <div className="hero2-inner">

          {/* Line 1: "WE ARE THE" */}
          <SplitText
            text="WE ARE THE"
            tag="div"
            className="hero2-line-1"
            delay={40}
            duration={1.2}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 70 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.05}
            rootMargin="-40px"
            textAlign="left"
            hoverRoll
            hoverRollDirection="center"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />

          {/* Line 2: "Alchemists" italic red */}
          <SplitText
            text="STORY TELLERS"
            tag="div"
            className="hero2-line-accent"
            delay={35}
            duration={1.35}
            ease="power4.out"
            splitType="chars"
            from={{ opacity: 0, y: 80, skewX: 6 }}
            to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.05}
            rootMargin="-40px"
            textAlign="left"
            hoverRoll
            hoverRollDirection="left"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />

          {/* Line 3: "OF DIGITAL NOIR." */}
          <SplitText
            text="OF VISUAL MAGIC."
            tag="div"
            className="hero2-line-2"
            delay={38}
            duration={1.2}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 70 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.05}
            rootMargin="-40px"
            textAlign="left"
            hoverRoll
            hoverRollDirection="center"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />

          {/* ── LOWER: image + text ── */}
          <div className="hero2-lower">

            {/* Image pane */}
            <div className="hero2-image-pane" data-reveal data-d="3">
              <img
                src="/image/about-3.webp"
                alt="Studio environment dark moody"
              />
              <span className="hero2-img-caption">Paris Studio — 2024</span>
            </div>

            {/* Text pane */}
            <div className="hero2-text-pane">

              <div>
                <p className="hero2-origin-label" data-reveal data-d="2">The Origin</p>
                <h2 className="hero2-sub-heading" data-reveal data-d="2">
                  WHERE VISION <br /> MEETS CRAFT
                </h2>
                <p className="hero2-paragraph" data-reveal data-d="3">
                  Born from a passion for storytelling, 21 fifty one  was created to transform ideas into powerful visual experiences.
We believe every frame holds meaning—where creativity, precision, and emotion come together to shape stories that leave a lasting impact.

                </p>
                <p className="hero2-paragraph" data-reveal data-d="3">
                  21 fiftyone  was born from a simple belief—every idea has the power to become something extraordinary when shaped with the right vision.
In a world filled with content, we focus on creating stories that stand apart—bold, cinematic, and emotionally driven.
We combine creative storytelling with technical precision, crafting visuals that are not just seen, but felt.

                </p>
              </div>

              {/* Quote */}
              <div className="hero2-quote-block" data-reveal data-d="4">
                <blockquote>
                  &ldquo;We don’t just create visuals. We craft stories that move, inspire, and stay with you.&rdquo;
                </blockquote>
                <cite>— Creative Team, 21 fiftyone</cite>
              </div>

              {/* Stats */}
              <div className="hero2-stats" data-reveal data-d="5">
                <div>
                  <span className="hero2-stat-num">100+</span>
                  <span className="hero2-stat-label">Projects</span>
                </div>
                <div>
                  <span className="hero2-stat-num">25+</span>
                  <span className="hero2-stat-label">Brands</span>
                </div>
                <div>
                  <span className="hero2-stat-num">10yr</span>
                  <span className="hero2-stat-label">Studio</span>
                </div>
              </div>

              {/* CTA */}
              <div className="hero2-cta-row" data-reveal data-d="6">
                <RollButton label="Our Work" href="/studio" />
                <span className="hero2-scroll-hint">Scroll to explore</span>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}