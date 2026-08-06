"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FloatingNavbar from "./Floatingnavbar";
import Footer from "./Footer";
import RollButton from "./Rollbutton";
import SplitText from "./Splittext";
import type { ServiceCard, FaqItem } from "@/lib/data/services";

interface Props {
  service: ServiceCard;
  allServices: ServiceCard[];
}

/* ══ FAQ ACCORDION ══ */
function FaqAccordion({ items, accent }: { items: FaqItem[]; accent: string }) {
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

export default function ServiceDetailClient({ service, allServices }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const accent = service.accentColor ?? "#c8372d";

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-csr]");
    if (!els) return;
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [service]);

  const titleLines = service.heroTitle.split("\n");
  const delivTitleLines = service.deliverablesTitle.split("\n");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sv-cream : #f2ede6;
          --sv-black : #0c0c0c;
          --sv-muted : #8a8480;
          --sv-line  : rgba(12,12,12,0.12);
        }

        .svd-wrap { width: 100%; background: var(--sv-cream); font-family: 'DM Sans', sans-serif; }

        .svd-layout {
          max-width: 1320px;
          margin: 0 auto;
          padding-top: 160px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 0;
          align-items: start;
        }

        .svd-sidebar {
          position: sticky;
          top: 120px;
          padding: 0 64px 80px 32px;
          border-left: 1px solid var(--sv-line);
          height: calc(100vh - 160px);
          overflow-y: auto;
        }
        .svd-sidebar-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c8372d;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .svd-sidebar-eyebrow::before { content: ''; width: 20px; height: 1px; background: #c8372d; }
        .svd-nav-list { display: flex; flex-direction: column; gap: 4px; }
        .svd-nav-item {
          display: flex;
          gap: 12px;
          padding: 14px;
          border-radius: 8px;
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .svd-nav-item:hover { background: rgba(12,12,12,0.04); }
        .svd-nav-item.active { border-left-color: #c8372d; background: rgba(200,55,45,0.06); }
        .svd-nav-index {
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          color: var(--sv-muted);
          padding-top: 2px;
          flex-shrink: 0;
        }
        .svd-nav-item.active .svd-nav-index { color: #c8372d; }
        .svd-nav-title {
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.4;
          color: var(--sv-black);
        }
        .svd-nav-item.active .svd-nav-title { color: #c8372d; }

        .svd-main { min-width: 0; padding: 0 64px 40px; }

        .svd-back {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--sv-muted);
          text-decoration: none;
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
          transition: color 0.25s ease;
        }
        .svd-back:hover { color: #c8372d; }

        .svc-card { position: relative; }
        .svc-card-index { display: flex; align-items: center; gap: 16px; margin-bottom: 44px; }
        .svc-card-index-num { font-size: 10px; font-weight: 500; letter-spacing: 0.3em; color: var(--accent, #c8372d); }
        .svc-card-index-line { height: 1px; background: var(--sv-line); width: 64px; }

        .svc-hero-row { display: grid; grid-template-columns: 1fr 42%; gap: 56px; align-items: start; }
        .svc-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.32em; text-transform: uppercase; color: var(--accent, #c8372d); display: block; margin-bottom: 14px; }
        .svc-hero-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(32px, 4.8vw, 68px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--sv-black) !important;
          text-transform: uppercase;
        }
        .svc-hero-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          font-size: clamp(28px, 4.2vw, 60px) !important;
          color: var(--accent, #c8372d) !important;
          line-height: 0.95 !important;
          margin-top: 0.06em;
        }
        .svc-hero-desc { font-size: 14px; line-height: 1.82; color: var(--sv-muted); font-weight: 300; max-width: 460px; margin-top: 22px; }
        .svc-hero-points { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-direction: column; gap: 0; }
        .svc-hero-point { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--sv-line); font-size: 13px; color: var(--sv-black); letter-spacing: 0.01em; transition: color 0.2s; }
        .svc-hero-point:first-child { border-top: 1px solid var(--sv-line); }
        .svc-hero-point:hover { color: var(--accent, #c8372d); }
        .svc-hero-point-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent, #c8372d); flex-shrink: 0; }

        .svc-hero-video-wrap { position: relative; width: 100%; aspect-ratio: 9 / 11; overflow: hidden; flex-shrink: 0; }
        .svc-hero-video-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .svc-video-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent, #c8372d); z-index: 2; }

        .svc-inner-divider { border-top: 1px solid var(--sv-line); margin: 44px 0; }

        .svc-ritual-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px; gap: 24px; }
        .svc-ritual-label { font-family: 'Playfair Display', serif !important; font-style: italic !important; font-size: clamp(20px, 2.6vw, 32px) !important; color: var(--sv-black) !important; font-weight: 400 !important; }
        .svc-ritual-tagline { font-size: 9px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: var(--sv-muted); text-align: right; max-width: 180px; line-height: 1.7; }
        .svc-steps { display: grid; grid-template-columns: repeat(3, 1fr); }
        .svc-step { padding: 0 36px 0 0; border-right: 1px solid var(--sv-line); }
        .svc-step:first-child { padding-left: 0; }
        .svc-step:nth-child(2) { padding-left: 36px; }
        .svc-step:last-child { border-right: none; padding-left: 36px; padding-right: 0; }
        .svc-step-num { font-family: 'Anton', sans-serif; font-size: 28px; color: rgba(12,12,12,0.07); display: block; margin-bottom: 12px; line-height: 1; }
        .svc-step-title { font-family: 'Anton', sans-serif; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sv-black); display: block; margin-bottom: 10px; }
        .svc-step-desc { font-size: 12px; line-height: 1.78; color: var(--sv-muted); font-weight: 300; margin: 0; }

        .svc-deliv-row { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        .svc-deliv-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(26px, 3.5vw, 52px) !important;
          line-height: 0.9 !important;
          color: var(--sv-black) !important;
          text-transform: uppercase;
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
        .svc-deliv-list { list-style: none; padding: 0; margin: 0; }
        .svc-deliv-item { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--sv-line); font-size: 13px; color: var(--sv-black); transition: color 0.2s; letter-spacing: 0.01em; }
        .svc-deliv-item:first-child { border-top: 1px solid var(--sv-line); }
        .svc-deliv-item:hover { color: var(--accent, #c8372d); }
        .svc-deliv-bullet { width: 5px; height: 5px; border-radius: 50%; background: var(--accent, #c8372d); flex-shrink: 0; }
        .svc-cta-wrap { margin-top: 32px; }

        .faq-wrap { width: 100%; }
        .faq-eyebrow { font-size: 9px; font-weight: 500; letter-spacing: 0.34em; text-transform: uppercase; color: var(--sv-muted); display: block; margin-bottom: 20px; }
        .faq-item { border-top: 1px solid var(--sv-line); }
        .faq-item:last-child { border-bottom: 1px solid var(--sv-line); }
        .faq-q { width: 100%; background: none; border: none; padding: 18px 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; cursor: pointer; text-align: left; }
        .faq-q-text { font-size: 13px; font-weight: 500; color: var(--sv-black); letter-spacing: 0.01em; transition: color 0.2s; line-height: 1.4; }
        .faq-item.faq-open .faq-q-text, .faq-q:hover .faq-q-text { color: var(--faq-accent, #c8372d); }
        .faq-icon { font-family: 'Anton', sans-serif; font-size: 18px; color: var(--faq-accent, #c8372d); flex-shrink: 0; line-height: 1; }
        .faq-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.38s cubic-bezier(0.16,1,0.3,1); overflow: hidden; }
        .faq-item.faq-open .faq-body { grid-template-rows: 1fr; }
        .faq-a { font-size: 13px; line-height: 1.78; color: var(--sv-muted); font-weight: 300; margin: 0; padding-bottom: 18px; }

        [data-csr] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        [data-csr].csr-in { opacity: 1; transform: none; }
        [data-csr][data-csd="1"] { transition-delay: 0.10s; }
        [data-csr][data-csd="2"] { transition-delay: 0.20s; }

        @media (max-width: 1000px) {
          .svd-layout { grid-template-columns: 1fr; padding-top: 140px; }
          .svd-sidebar { display: none; }
          .svd-back { display: inline-flex; }
          .svd-main { padding: 0 40px 40px; }
        }
        @media (max-width: 900px) {
          .svc-hero-row { grid-template-columns: 1fr; gap: 32px; }
          .svc-hero-video-wrap { aspect-ratio: 16 / 9; width: 100%; }
          .svc-steps { grid-template-columns: 1fr; }
          .svc-step { border-right: none; border-bottom: 1px solid var(--sv-line); padding: 20px 0 !important; }
          .svc-step:last-child { border-bottom: none; }
          .svc-deliv-row { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 560px) {
          .svd-layout { padding-top: 120px; }
          .svd-main { padding: 0 24px 32px; }
        }
      `}</style>

      <FloatingNavbar />

      <div className="svd-wrap" ref={sectionRef}>
        <div className="svd-layout">
          <div className="svd-main">
            <Link href="/services" className="svd-back">
              ← All Services
            </Link>

            <div className="svc-card" style={{ "--accent": accent } as React.CSSProperties}>
              <div className="svc-card-index" data-csr>
                <span className="svc-card-index-num">
                  {String(allServices.findIndex((s) => s.slug === service.slug) + 1).padStart(2, "0")}
                </span>
                <span className="svc-card-index-line" />
              </div>

              <div className="svc-hero-row">
                <div className="svc-hero-left">
                  {service.eyebrow && <span className="svc-eyebrow" data-csr>{service.eyebrow}</span>}

                  {titleLines.map((line, li) => (
                    <SplitText
                      key={`${service.id}-title-${li}`}
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
                    />
                  ))}

                  {service.heroTitleAccent && (
                    <SplitText
                      key={`${service.id}-accent`}
                      text={service.heroTitleAccent}
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
                    />
                  )}

                  <p className="svc-hero-desc" data-csr data-csd="1">{service.heroDesc}</p>

                  {service.heroPoints && service.heroPoints.length > 0 && (
                    <ul className="svc-hero-points" data-csr data-csd="2">
                      {service.heroPoints.map((pt, i) => (
                        <li key={i} className="svc-hero-point">
                          <span className="svc-hero-point-dot" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="svc-hero-video-wrap" data-csr data-csd="1">
                  <video src={service.heroVideo} autoPlay muted loop playsInline />
                  <div className="svc-video-bar" />
                </div>
              </div>

              <div className="svc-inner-divider" />

              <div className="svc-ritual-row" data-csr data-csd="2">
                <div className="svc-ritual-header">
                  {service.ritualLabel && (
                    <SplitText
                      key={`${service.id}-ritual`}
                      text={service.ritualLabel}
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
                    />
                  )}
                  {service.ritualTagline && (
                    <span className="svc-ritual-tagline">{service.ritualTagline}</span>
                  )}
                </div>

                <div className="svc-steps">
                  {service.ritualSteps.map((step) => (
                    <div className="svc-step" key={step.num}>
                      <span className="svc-step-num">{step.num}</span>
                      <span className="svc-step-title">{step.title}</span>
                      <p className="svc-step-desc">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="svc-inner-divider" />

              <div className="svc-deliv-row" data-csr data-csd="2">
                <div className="svc-deliv-left">
                  {delivTitleLines.map((line, li) => (
                    <SplitText
                      key={`${service.id}-deliv-${li}`}
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
                    />
                  ))}

                  <ul className="svc-deliv-list">
                    {service.deliverables.map((d, i) => (
                      <li className="svc-deliv-item" key={i}>
                        <span className="svc-deliv-bullet" />
                        {d.label}
                      </li>
                    ))}
                  </ul>

                  {service.ctaLabel && (
                    <div className="svc-cta-wrap">
                      <RollButton label={service.ctaLabel} href={service.ctaHref ?? "#"} />
                    </div>
                  )}
                </div>

                {service.faq && service.faq.length > 0 && (
                  <div className="svc-deliv-right">
                    <FaqAccordion items={service.faq} accent={accent} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="svd-sidebar">
            <p className="svd-sidebar-eyebrow">All Services</p>
            <nav className="svd-nav-list">
              {allServices.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/services/${s.slug}`}
                  className={`svd-nav-item ${s.slug === service.slug ? "active" : ""}`}
                >
                  <span className="svd-nav-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="svd-nav-title">{s.heroTitle}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}