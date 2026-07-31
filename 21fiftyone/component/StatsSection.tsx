"use client";

import { useEffect, useRef } from "react";

const CARDS = [
  {
    number: "100+",
    label: "Projects Delivered",
    sub: "Stories brought to life",
    side: "left",
  },
  {
    number: "25+",
    label: "Global Clients",
    sub: "Brands we’ve partnered with",
    side: "right",
  },
  {
    number: "10yr",
    label: "Studio Experience",
    sub: "Of creative excellence",
    side: "left",
  },
  {
    number: "98%",
    label: "Client Retention",
    sub: "Client trust & retention",
    side: "right",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-stats-card]");
    if (!cards) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("stats-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream:    #f2ede6;
          --black:    #0c0c0c;
          --red:      #c8372d;
          --red-deep: #9e2118;
          --muted:    #8a8480;
          --line:     rgba(12,12,12,0.10);
          --card-bg:  #ffffff;
        }

        .stats-section {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 140px;
          position: relative;
        }
        .stats-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,55,45,0.18), transparent);
        }

        /* Eyebrow */
        .stats-eyebrow {
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .stats-eyebrow::before,
        .stats-eyebrow::after {
          content: '';
          width: 32px;
          height: 1px;
          background: var(--red);
          opacity: 0.45;
        }

        /* Grid */
        .stats-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 64px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        /* Card */
        .stats-card {
          background: var(--card-bg);
          border: 0.5px solid var(--line);
          border-radius: 16px;
          padding: 48px 44px 40px;
          position: relative;
          overflow: hidden;
          cursor: default;

          opacity: 0;
          transition:
            opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .stats-card[data-side="left"]  { transform: translateX(-52px); }
        .stats-card[data-side="right"] { transform: translateX(52px); }

        .stats-card.stats-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .stats-card:nth-child(1) { transition-delay: 0s;     }
        .stats-card:nth-child(2) { transition-delay: 0.10s;  }
        .stats-card:nth-child(3) { transition-delay: 0.20s;  }
        .stats-card:nth-child(4) { transition-delay: 0.30s;  }

        /* Hover lift */
        .stats-card:hover {
          border-color: rgba(200,55,45,0.22);
          box-shadow: 0 8px 40px rgba(12,12,12,0.08);
        }

        /* Red corner accent line (top-left) */
        .stats-card::before {
          content: '';
          position: absolute;
          top: 0; left: 40px;
          width: 0;
          height: 2px;
          background: var(--red);
          border-radius: 0 0 2px 2px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: inherit;
        }
        .stats-card.stats-visible::before {
          width: 48px;
        }

        /* Subtle corner watermark */
        .stats-card::after {
          content: attr(data-index);
          position: absolute;
          bottom: 20px;
          right: 28px;
          font-family: 'Anton', sans-serif;
          font-size: 72px;
          line-height: 1;
          color: rgba(12,12,12,0.04);
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.02em;
        }

        /* Number */
        .stats-number {
          font-family: 'Anton', sans-serif;
          font-size: clamp(52px, 6vw, 80px);
          line-height: 1;
          color: var(--black);
          letter-spacing: -0.02em;
          display: block;
          margin-bottom: 16px;
          transition: color 0.25s ease;
        }
        .stats-card:hover .stats-number {
          color: var(--red);
        }

        /* Label */
        .stats-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--black);
          display: block;
          margin-bottom: 10px;
        }

        /* Divider */
        .stats-divider {
          width: 24px;
          height: 1px;
          background: var(--red);
          opacity: 0.5;
          margin-bottom: 12px;
          transition: width 0.4s ease;
        }
        .stats-card:hover .stats-divider {
          width: 40px;
          opacity: 0.8;
        }

        /* Sub */
        .stats-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.65;
          color: var(--muted);
          display: block;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .stats-grid {
            grid-template-columns: 1fr;
            padding: 0 40px;
            gap: 16px;
          }
          .stats-card[data-side="left"],
          .stats-card[data-side="right"] {
            transform: translateY(36px);
          }
          .stats-card.stats-visible {
            transform: translateY(0);
          }
        }
        @media (max-width: 500px) {
          .stats-section { padding: 80px 0 100px; }
          .stats-grid { padding: 0 24px; }
          .stats-card { padding: 36px 32px 32px; }
        }
      `}</style>

      <section className="stats-section" ref={sectionRef}>
        <p className="stats-eyebrow">By The Numbers</p>

        <div className="stats-grid">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="stats-card"
              data-stats-card
              data-side={card.side}
              data-index={String(i + 1).padStart(2, "0")}
            >
              <span className="stats-number">{card.number}</span>
              <span className="stats-label">{card.label}</span>
              <div className="stats-divider" />
              <span className="stats-sub">{card.sub}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}