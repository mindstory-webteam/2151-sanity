"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import FloatingNavbar from "./Floatingnavbar";
import Footer from "./Footer";
import SplitText from "./Splittext";
import type { ServiceCard } from "@/lib/data/services";

interface Props {
  services: ServiceCard[];
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  desc?: string;
  limit?: number;
  showChrome?: boolean; // include navbar/footer — off when embedded on homepage
}

export default function ServicesListClient({
  services,
  eyebrow = "What We Do",
  title = "SERVICES BUILT FOR THE",
  titleAccent = "Future.",
  desc = "Every project is crafted with purpose and precision. We create cinematic content and visual experiences that go beyond trends—designed to connect, engage, and leave a lasting impact.",
  limit,
  showChrome = true,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const list = limit ? services.slice(0, limit) : services;

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
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list]);

  const body = (
    <div className="svl-wrap" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --svl-cream: #f2ede6;
          --svl-black: #0c0c0c;
          --svl-red:   #c8372d;
          --svl-muted: #8a8480;
          --svl-line:  rgba(12,12,12,0.12);
        }

        .svl-wrap { width: 100%; background: var(--svl-cream); font-family: 'DM Sans', sans-serif; }

        .svl-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 96px 64px 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: end;
          border-bottom: 1px solid var(--svl-line);
        }
        .svl-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--svl-red);
          display: block;
          margin-bottom: 18px;
        }
        .svl-title {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(40px, 6.5vw, 88px) !important;
          line-height: 0.9 !important;
          letter-spacing: -0.02em !important;
          color: var(--svl-black) !important;
          text-transform: uppercase;
        }
        .svl-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-weight: 700 !important;
          font-size: clamp(36px, 5.5vw, 76px) !important;
          color: var(--svl-red) !important;
          line-height: 0.98 !important;
        }
        .svl-desc {
          font-size: 15px;
          line-height: 1.82;
          color: var(--svl-muted);
          font-weight: 300;
          max-width: 380px;
          align-self: end;
        }

        .svl-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 64px 140px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .svl-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 0.5px solid var(--svl-line);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          position: relative;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .svl-card:hover {
          border-color: rgba(200,55,45,0.22);
          box-shadow: 0 8px 40px rgba(12,12,12,0.08);
        }
        .svl-card-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          background: #e5ded3;
        }
        .svl-card-video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: grayscale(30%);
          transition: filter 0.8s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .svl-card:hover .svl-card-video-wrap video {
          filter: grayscale(0%);
          transform: scale(1.05);
        }
        .svl-card-body { padding: 26px 24px 30px; }
        .svl-card-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--svl-red);
          display: block;
          margin-bottom: 12px;
        }
        .svl-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1.15;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--svl-black);
          margin-bottom: 12px;
        }
        .svl-card-desc {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          color: var(--svl-muted);
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .svl-card-link {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--svl-black);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid var(--svl-line);
        }
        .svl-card:hover .svl-card-link { color: var(--svl-red); }

        [data-reveal] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: none; }
        [data-reveal][data-d="1"] { transition-delay: 0.06s; }
        [data-reveal][data-d="2"] { transition-delay: 0.14s; }
        [data-reveal][data-d="3"] { transition-delay: 0.22s; }
        [data-reveal][data-d="4"] { transition-delay: 0.30s; }
        [data-reveal][data-d="5"] { transition-delay: 0.38s; }
        [data-reveal][data-d="6"] { transition-delay: 0.46s; }

        @media (max-width: 1100px) {
          .svl-header { padding: 72px 40px 48px; grid-template-columns: 1fr; gap: 24px; }
          .svl-grid   { padding: 56px 40px 100px; grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .svl-header { padding: 56px 24px 40px; }
          .svl-grid   { padding: 48px 24px 80px; grid-template-columns: 1fr; gap: 22px; }
        }
      `}</style>

      <div className="svl-header">
        <div>
          <span className="svl-eyebrow" data-reveal>{eyebrow}</span>
          <SplitText
            text={title}
            tag="div"
            className="svl-title"
            splitType="chars"
            delay={38}
            duration={1.15}
            ease="power3.out"
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.05}
            rootMargin="-30px"
            textAlign="left"
          />
          <SplitText
            text={titleAccent}
            tag="div"
            className="svl-accent"
            splitType="chars"
            delay={30}
            duration={1.3}
            ease="power4.out"
            from={{ opacity: 0, y: 70, skewX: 6 }}
            to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.05}
            rootMargin="-30px"
            textAlign="left"
          />
        </div>
        <p className="svl-desc" data-reveal data-d="2">{desc}</p>
      </div>

      <div className="svl-grid">
        {list.map((service, i) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="svl-card"
            data-reveal
            data-d={String(Math.min(i + 1, 6))}
          >
            <div className="svl-card-video-wrap">
              <video src={service.heroVideo} autoPlay muted loop playsInline />
            </div>
            <div className="svl-card-body">
              {service.eyebrow && (
                <span className="svl-card-eyebrow">{service.eyebrow}</span>
              )}
              <h2 className="svl-card-title">{service.heroTitle}</h2>
              <p className="svl-card-desc">{service.heroDesc}</p>
              <span className="svl-card-link">View Service →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  if (!showChrome) return body;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <FloatingNavbar />
      {body}
      <Footer />
    </div>
  );
}