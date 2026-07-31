"use client";

import { useEffect, useRef, useState } from "react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
export interface RitualStep {
  num: string;
  title: string;
  desc: string;
}

export interface Deliverable {
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceCard {
  id: string | number;

  /* Hero */
  eyebrow?: string;
  heroTitle: string;
  heroTitleAccent?: string;
  heroDesc: string;
  heroVideo: string;        // ← now a video instead of image
  heroPoints?: string[];    // ← new: bullet points under desc

  /* Ritual */
  ritualLabel?: string;
  ritualTagline?: string;
  ritualSteps: RitualStep[];

  /* Deliverables */
  deliverablesTitle: string;
  deliverables: Deliverable[];
  faq?: FaqItem[];          // ← new: FAQ replaces right image

  /* CTA */
  ctaLabel?: string;
  ctaHref?: string;

  /* Per-card accent colour */
  accentColor?: string;
}

export interface ServicesSectionProps {
  sectionEyebrow?: string;
  sectionTitle?: string;
  sectionTitleAccent?: string;
  sectionDesc?: string;
  footerLabel?: string;
  services: ServiceCard[];
}

/* ══════════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════════ */
function FaqAccordion({
  items,
  accent,
}: {
  items: FaqItem[];
  accent: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-wrap">
      <span className="faq-eyebrow">FAQ</span>
      {items.map((item, i) => (
        <div
          key={i}
          className={`faq-item${open === i ? " faq-open" : ""}`}
          style={{ "--faq-accent": accent } as React.CSSProperties}
        >
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="faq-q-text">{item.question}</span>
            <span className="faq-icon">{open === i ? "−" : "+"}</span>
          </button>
          <div className="faq-body">
            <p className="faq-a">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SINGLE SERVICE CARD
══════════════════════════════════════════════ */
function SingleServiceCard({
  card,
  index,
}: {
  card: ServiceCard;
  index: number;
}) {
  const accent = card.accentColor ?? "#c8372d";
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-csr]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("csr-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.07 }
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  const titleLines     = card.heroTitle.split("\n");
  const delivTitleLines = card.deliverablesTitle.split("\n");

  return (
    <div
      className="svc-card"
      ref={cardRef}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* card index */}
      <div className="svc-card-index" data-csr>
        <span className="svc-card-index-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="svc-card-index-line" />
      </div>

      {/* ══ HERO ROW — left text | right VIDEO ══ */}
      <div className="svc-hero-row">
        <div className="svc-hero-left">
          {card.eyebrow && (
            <span className="svc-eyebrow" data-csr>{card.eyebrow}</span>
          )}

          {titleLines.map((line, li) => (
            <SplitText
              key={`${card.id}-title-${li}`}
              text={line}
              tag="div"
              className="svc-hero-title"
              delay={40}
              duration={1.2}
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
          ))}

          {card.heroTitleAccent && (
            <SplitText
              key={`${card.id}-accent`}
              text={card.heroTitleAccent}
              tag="div"
              className="svc-hero-accent"
              delay={32}
              duration={1.4}
              ease="power4.out"
              splitType="chars"
              from={{ opacity: 0, y: 70, skewX: 6 }}
              to={{ opacity: 1, y: 0, skewX: 0 }}
              threshold={0.05}
              rootMargin="-20px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="left"
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            />
          )}

          <p className="svc-hero-desc" data-csr data-csd="1">{card.heroDesc}</p>

          {/* ── hero points ── */}
          {card.heroPoints && card.heroPoints.length > 0 && (
            <ul className="svc-hero-points" data-csr data-csd="2">
              {card.heroPoints.map((pt, i) => (
                <li key={i} className="svc-hero-point">
                  <span className="svc-hero-point-dot" />
                  {pt}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── BIG VIDEO on the right ── */}
        <div className="svc-hero-video-wrap" data-csr data-csd="1">
          <video
            src={card.heroVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          {/* subtle red accent bar on top */}
          <div className="svc-video-bar" />
        </div>
      </div>

      <div className="svc-inner-divider" />

      {/* ══ RITUAL ROW ══ */}
      <div className="svc-ritual-row" data-csr data-csd="2">
        <div className="svc-ritual-header">
          {card.ritualLabel && (
            <SplitText
              key={`${card.id}-ritual`}
              text={card.ritualLabel}
              tag="div"
              className="svc-ritual-label"
              delay={30}
              duration={1.1}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.05}
              rootMargin="-10px"
              textAlign="left"
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            />
          )}
          {card.ritualTagline && (
            <span className="svc-ritual-tagline">{card.ritualTagline}</span>
          )}
        </div>

        <div className="svc-steps">
          {card.ritualSteps.map((step) => (
            <div className="svc-step" key={step.num}>
              <span className="svc-step-num">{step.num}</span>
              <span className="svc-step-title">{step.title}</span>
              <p className="svc-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="svc-inner-divider" />

      {/* ══ DELIVERABLES ROW — left list | right FAQ ══ */}
      <div className="svc-deliv-row" data-csr data-csd="2">
        <div className="svc-deliv-left">
          {delivTitleLines.map((line, li) => (
            <SplitText
              key={`${card.id}-deliv-${li}`}
              text={line}
              tag="div"
              className={
                li === delivTitleLines.length - 1
                  ? "svc-deliv-title svc-deliv-title-accent"
                  : "svc-deliv-title"
              }
              delay={30}
              duration={1.1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.05}
              rootMargin="-10px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="center"
              autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            />
          ))}

          <ul className="svc-deliv-list">
            {card.deliverables.map((d, i) => (
              <li className="svc-deliv-item" key={i}>
                <span className="svc-deliv-bullet" />
                {d.label}
              </li>
            ))}
          </ul>

          {card.ctaLabel && (
            <div className="svc-cta-wrap">
              <RollButton label={card.ctaLabel} href={card.ctaHref ?? "#"} />
            </div>
          )}
        </div>

        {/* ── FAQ accordion on the right ── */}
        {card.faq && card.faq.length > 0 && (
          <div className="svc-deliv-right">
            <FaqAccordion items={card.faq} accent={accent} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
export default function ServicesSection(props: ServicesSectionProps) {
  const {
    sectionEyebrow,
    sectionTitle,
    sectionTitleAccent,
    sectionDesc,
    footerLabel,
    services,
  } = props;

  const sectionRef   = useRef<HTMLElement>(null);
  const secTitleLines = sectionTitle ? sectionTitle.split("\n") : [];

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sv-cream : #f2ede6;
          --sv-black : #0c0c0c;
          --sv-muted : #8a8480;
          --sv-line  : rgba(12,12,12,0.12);
        }

        /* ── shell ── */
        .sv-section {
          width: 100%;
          background: var(--sv-cream);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .sv-section::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--sv-line);
        }

        /* ══ SECTION HEADER ══ */
        .sv-section-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 96px 64px 72px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: end;
          border-bottom: 1px solid var(--sv-line);
        }
        .sv-sec-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #c8372d;
          display: block;
          margin-bottom: 18px;
        }
        .sv-sec-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(48px, 7vw, 96px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--sv-black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding: 4px 6px !important;
          margin-left: -6px !important;
        }
        .sv-sec-title > div { overflow: visible !important; }
        .sv-sec-title [data-roll-unit] { overflow: hidden; }
        .sv-sec-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          font-size: clamp(42px, 6vw, 88px) !important;
          color: #c8372d !important;
          line-height: 0.95 !important;
          letter-spacing: -0.01em !important;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          margin-top: 0.06em;
        }
        .sv-sec-accent > div { overflow: visible !important; }
        .sv-sec-accent [data-roll-unit] { overflow: hidden; }
        .sv-sec-desc {
          font-size: 15px;
          line-height: 1.82;
          color: var(--sv-muted);
          font-weight: 300;
          max-width: 380px;
          align-self: end;
        }

        /* ══ CARDS WRAPPER ══ */
        .sv-cards-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          display: flex;
          flex-direction: column;
        }

        /* ══ SINGLE CARD ══ */
        .svc-card {
          position: relative;
          border-bottom: 1px solid var(--sv-line);
          padding: 80px 0 88px;
        }
        .svc-card:last-child { border-bottom: none; }

        .svc-card-index {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 44px;
        }
        .svc-card-index-num {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: var(--accent, #c8372d);
        }
        .svc-card-index-line {
          height: 1px;
          background: var(--sv-line);
          width: 64px;
        }

        /* ── HERO ROW ── */
        .svc-hero-row {
          display: grid;
          /* left text gets ~55%, video gets the rest */
          grid-template-columns: 1fr 42%;
          gap: 56px;
          align-items: start;
        }

        .svc-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--accent, #c8372d);
          display: block;
          margin-bottom: 14px;
        }
        .svc-hero-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(32px, 4.8vw, 68px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--sv-black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding: 4px 6px !important;
          margin-left: -6px !important;
        }
        .svc-hero-title > div { overflow: visible !important; }
        .svc-hero-title [data-roll-unit] { overflow: hidden; }
        .svc-hero-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          font-size: clamp(28px, 4.2vw, 60px) !important;
          color: var(--accent, #c8372d) !important;
          line-height: 0.95 !important;
          letter-spacing: -0.01em !important;
          display: block !important;
          overflow: visible !important;
          padding-left: 6px !important;
          margin-left: -6px !important;
          margin-top: 0.06em;
        }
        .svc-hero-accent > div { overflow: visible !important; }
        .svc-hero-accent [data-roll-unit] { overflow: hidden; }

        .svc-hero-desc {
          font-size: 14px;
          line-height: 1.82;
          color: var(--sv-muted);
          font-weight: 300;
          max-width: 380px;
          margin-top: 22px;
        }

        /* hero points */
        .svc-hero-points {
          list-style: none;
          padding: 0;
          margin: 22px 0 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .svc-hero-point {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid var(--sv-line);
          font-size: 13px;
          color: var(--sv-black);
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .svc-hero-point:first-child { border-top: 1px solid var(--sv-line); }
        .svc-hero-point:hover { color: var(--accent, #c8372d); }
        .svc-hero-point-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent, #c8372d);
          flex-shrink: 0;
        }

        /* ── BIG VIDEO ── */
        .svc-hero-video-wrap {
          position: relative;
          width: 100%;
          /* tall portrait-ish ratio to feel cinematic */
          aspect-ratio: 9 / 11;
          overflow: hidden;
          flex-shrink: 0;
        }
        .svc-hero-video-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .svc-hero-video-wrap:hover video { transform: scale(1.03); }
        .svc-video-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent, #c8372d);
          z-index: 2;
        }

        /* ── INNER DIVIDER ── */
        .svc-inner-divider {
          border-top: 1px solid var(--sv-line);
          margin: 44px 0;
        }

        /* ── RITUAL ROW ── */
        .svc-ritual-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 40px;
          gap: 24px;
        }
        .svc-ritual-label {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(20px, 2.6vw, 32px) !important;
          color: var(--sv-black) !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em !important;
          display: block !important;
          overflow: visible !important;
        }
        .svc-ritual-label > div { overflow: visible !important; }
        .svc-ritual-tagline {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--sv-muted);
          text-align: right;
          max-width: 180px;
          line-height: 1.7;
        }
        .svc-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .svc-step {
          padding: 0 36px 0 0;
          border-right: 1px solid var(--sv-line);
        }
        .svc-step:first-child { padding-left: 0; }
        .svc-step:nth-child(2) { padding-left: 36px; }
        .svc-step:last-child { border-right: none; padding-left: 36px; padding-right: 0; }
        .svc-step-num {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          color: rgba(12,12,12,0.07);
          display: block;
          margin-bottom: 12px;
          line-height: 1;
        }
        .svc-step-title {
          font-family: 'Anton', sans-serif;
          font-size: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sv-black);
          display: block;
          margin-bottom: 10px;
        }
        .svc-step-desc {
          font-size: 12px;
          line-height: 1.78;
          color: var(--sv-muted);
          font-weight: 300;
          margin: 0;
        }

        /* ── DELIVERABLES ROW ── */
        .svc-deliv-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .svc-deliv-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(26px, 3.5vw, 52px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.015em !important;
          color: var(--sv-black) !important;
          text-transform: uppercase;
          display: block !important;
          overflow: visible !important;
          padding: 3px 6px !important;
          margin-left: -6px !important;
          margin-bottom: 4px;
        }
        .svc-deliv-title-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          color: var(--sv-black) !important;
          text-transform: none !important;
          margin-bottom: 28px;
        }
        .svc-deliv-title > div { overflow: visible !important; }
        .svc-deliv-title [data-roll-unit] { overflow: hidden; }
        .svc-deliv-list {
          list-style: none;
          padding: 0; margin: 0;
        }
        .svc-deliv-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid var(--sv-line);
          font-size: 13px;
          color: var(--sv-black);
          transition: color 0.2s;
          cursor: default;
          letter-spacing: 0.01em;
        }
        .svc-deliv-item:first-child { border-top: 1px solid var(--sv-line); }
        .svc-deliv-item:hover { color: var(--accent, #c8372d); }
        .svc-deliv-bullet {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent, #c8372d);
          flex-shrink: 0;
        }
        .svc-cta-wrap { margin-top: 32px; }

        /* ── FAQ ACCORDION ── */
        .faq-wrap {
          width: 100%;
        }
        .faq-eyebrow {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--sv-muted);
          display: block;
          margin-bottom: 20px;
        }
        .faq-item {
          border-top: 1px solid var(--sv-line);
        }
        .faq-item:last-child { border-bottom: 1px solid var(--sv-line); }

        .faq-q {
          width: 100%;
          background: none;
          border: none;
          padding: 18px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          text-align: left;
        }
        .faq-q-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--sv-black);
          letter-spacing: 0.01em;
          transition: color 0.2s;
          line-height: 1.4;
        }
        .faq-item.faq-open .faq-q-text,
        .faq-q:hover .faq-q-text {
          color: var(--faq-accent, #c8372d);
        }
        .faq-icon {
          font-family: 'Anton', sans-serif;
          font-size: 18px;
          color: var(--faq-accent, #c8372d);
          flex-shrink: 0;
          line-height: 1;
          transition: transform 0.3s;
        }
        .faq-item.faq-open .faq-icon { transform: rotate(0deg); }

        /* accordion body — CSS height trick */
        .faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.38s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
        }
        .faq-item.faq-open .faq-body {
          grid-template-rows: 1fr;
        }
        .faq-body > p.faq-a {
          overflow: hidden;
        }
        .faq-a {
          font-size: 13px;
          line-height: 1.78;
          color: var(--sv-muted);
          font-weight: 300;
          margin: 0;
          padding-bottom: 18px;
        }

        /* ══ FOOTER STRIP ══ */
        .sv-footer-strip {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 64px;
          border-top: 1px solid var(--sv-line);
          display: flex;
          justify-content: center;
        }
        .sv-footer-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--sv-muted);
        }

        /* ══ REVEALS ══ */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: none; }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.30s; }
        [data-csr] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        [data-csr].csr-in { opacity: 1; transform: none; }
        [data-csr][data-csd="1"] { transition-delay: 0.10s; }
        [data-csr][data-csd="2"] { transition-delay: 0.20s; }
        [data-csr][data-csd="3"] { transition-delay: 0.30s; }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 1100px) {
          .sv-section::before { left: 36px; right: 36px; }
          .sv-section-header  { padding: 72px 36px 56px; grid-template-columns: 1fr; gap: 24px; }
          .sv-cards-wrap      { padding: 0 36px; }
          .sv-footer-strip    { padding: 20px 36px; }
        }
        @media (max-width: 900px) {
          .svc-hero-row   { grid-template-columns: 1fr; gap: 32px; }
          .svc-hero-video-wrap { aspect-ratio: 16 / 9; width: 100%; }
          .svc-steps      { grid-template-columns: 1fr; }
          .svc-step       { border-right: none; border-bottom: 1px solid var(--sv-line); padding: 20px 0 !important; }
          .svc-step:last-child { border-bottom: none; }
          .svc-deliv-row  { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .sv-section::before { left: 24px; right: 24px; }
          .sv-section-header  { padding: 60px 24px 48px; }
          .sv-cards-wrap      { padding: 0 24px; }
          .svc-card           { padding: 56px 0 64px; }
          .svc-ritual-header  { flex-direction: column; gap: 8px; }
          .svc-ritual-tagline { text-align: left; max-width: 100%; }
          .sv-footer-strip    { padding: 18px 24px; }
        }
      `}</style>

      <section className="sv-section" ref={sectionRef}>

        {(sectionEyebrow || sectionTitle || sectionDesc) && (
          <div className="sv-section-header">
            <div>
              {sectionEyebrow && (
                <span className="sv-sec-eyebrow" data-reveal>{sectionEyebrow}</span>
              )}
              {secTitleLines.map((line, li) => (
                <SplitText
                  key={`sec-title-${li}`}
                  text={line}
                  tag="div"
                  className="sv-sec-title"
                  delay={42}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 70 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.05}
                  rootMargin="-30px"
                  textAlign="left"
                  hoverRoll
                  hoverRollDirection="center"
                  autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                />
              ))}
              {sectionTitleAccent && (
                <SplitText
                  key="sec-accent"
                  text={sectionTitleAccent}
                  tag="div"
                  className="sv-sec-accent"
                  delay={34}
                  duration={1.4}
                  ease="power4.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 80, skewX: 6 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  threshold={0.05}
                  rootMargin="-30px"
                  textAlign="left"
                  hoverRoll
                  hoverRollDirection="left"
                  autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
                />
              )}
            </div>
            {sectionDesc && (
              <p className="sv-sec-desc" data-reveal data-d="2">{sectionDesc}</p>
            )}
          </div>
        )}

        <div className="sv-cards-wrap">
          {services.map((card, i) => (
            <SingleServiceCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {footerLabel && (
          <div className="sv-footer-strip">
            <span className="sv-footer-label">{footerLabel}</span>
          </div>
        )}

      </section>
    </>
  );
}