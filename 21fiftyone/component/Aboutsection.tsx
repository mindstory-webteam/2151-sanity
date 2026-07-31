"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext"; // adjust path as needed
import RollButton from "./Rollbutton";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll reveal for non-heading elements */
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

  const processSteps = [
    {
      num: "01",
      title: "CONCEIVE",
      desc: "We understand your brand, audience, message, budget, location, and final use case before suggesting the right creative direction.",
      icon: "◎",
    },
    {
      num: "02",
      title: "DESIGN",
      desc: "We shape the idea into a visual plan with scripts, mood references, shot flow, storyboards, and production requirements.",
      icon: "◈",
    },
    {
      num: "03",
      title: "PRODUCE",
      desc: "We handle the shoot with the right crew, equipment, lighting, direction, and on-location coordination for the video format.",
      icon: "◐",
    },
    {
      num: "04",
      title: "DELIVER",
      desc: "We edit, grade, refine, and export the final videos in formats suitable for websites, ads, presentations, reels, and digital campaigns.",
      icon: "◉",
    },
  ];

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

        /* ─── Base Section ─────────────────────────────────────────── */
        .about {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 0;
          overflow: hidden;
          position: relative;
          text-align: justify;
          box-sizing: border-box;
        }
        .about::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .about-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          box-sizing: border-box;
        }

        /* ─── Label row ─────────────────────────────────────────────── */
        .about-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .about-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
        }
        .about-label-right {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ─── Hero grid ─────────────────────────────────────────────── */
        .about-hero {
          display: grid;
          grid-template-columns: 1fr 580px;
          gap: 0;
          align-items: end;
          margin-bottom: 96px;
        }

        /* ─── SplitText headings ────────────────────────────────────── */
        .about-headline {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(56px, 12vw, 168px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          padding-bottom: 10px;
          display: block;
          overflow: visible;
        }
        .about-headline-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(40px, 8.5vw, 120px) !important;
          color: var(--red) !important;
          line-height: 1 !important;
          letter-spacing: -0.01em !important;
          display: block;
          margin-top: 8px;
          overflow: visible;
        }
        .about-headline [data-roll-unit],
        .about-headline-accent [data-roll-unit] {
          overflow: hidden;
        }

        /* ─── Dark intro card ───────────────────────────────────────── */
        .about-intro-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          align-self: end;
          margin-left: 64px;
          box-sizing: border-box;
        }
        .about-intro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .about-intro-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #b0a99e;
          margin-bottom: 28px;
          font-weight: 300;
        }
        .card-stat {
          display: flex;
          gap: 48px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }
        .stat-num {
          font-family: 'Anton', sans-serif;
          font-size: 44px;
          line-height: 1;
          color: #fff;
          display: block;
        }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin-top: 6px;
          display: block;
        }

        /* ─── Body grid ─────────────────────────────────────────────── */
        .about-body-grid {
          display: grid;
          grid-template-columns: 380px 1fr 300px;
          gap: 56px;
          align-items: start;
        }

        /* ─── Image ─────────────────────────────────────────────────── */
        .image-stack { position: relative; }
        .image-main {
          width: 100%;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .image-main img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(15%);
          transition: filter 0.6s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .image-main:hover img { filter: grayscale(0%); transform: scale(1.04); }
        .image-accent {
          position: absolute;
          bottom: -28px; right: -28px;
          width: 140px; height: 100px;
          overflow: hidden;
          border: 3px solid var(--cream);
        }
        .image-accent img { width: 100%; height: 100%; object-fit: cover; }
        .image-caption {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }

        /* ─── Text column ───────────────────────────────────────────── */
        .about-text-col { padding-top: 8px; }
        .about-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
        }
        .about-paragraph {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.82;
          color: #3a3735;
          font-weight: 300;
          margin-bottom: 24px;
        }
        .about-quote-block {
          margin: 44px 0;
          padding: 36px 40px;
          background: #eae4db;
          position: relative;
        }
        .about-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          color: var(--red);
          opacity: 0.18;
          position: absolute;
          top: -16px; left: 24px;
          line-height: 1;
        }
        .about-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 22px;
          line-height: 1.5;
          color: var(--black);
          position: relative;
          z-index: 1;
          margin: 0;
        }
        .about-quote-block cite {
          font-family: 'DM Sans', sans-serif;
          font-style: normal;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 20px;
          display: block;
        }

        /* ─── Tags ──────────────────────────────────────────────────── */
        .about-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 36px; }
        .tag {
          border: 1px solid rgba(12,12,12,0.18);
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--black);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.25s;
        }
        .tag::after {
          content: '';
          position: absolute; inset: 0;
          background: #c8372d;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          z-index: -1;
        }
        .tag:hover { color: var(--cream); border-color: var(--black); }
        .tag:hover::after { transform: scaleX(1); }

        /* ─── Right col ─────────────────────────────────────────────── */
        .about-right-col { display: flex; flex-direction: column; gap: 32px; padding-top: 8px; }
        .v-marquee-wrap {
          height: 160px;
          overflow: hidden;
          border-left: 1px solid var(--line);
          padding-left: 24px;
        }
        .v-marquee {
          display: flex;
          flex-direction: column;
          animation: marqueeUp 10s linear infinite;
        }
        .v-marquee-item {
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 10px 0;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .v-marquee-item:hover { color: var(--red); }
        @keyframes marqueeUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        /* ══════════════════════════════════════════════════════════════
           ─── PROCESS SECTION ─────────────────────────────────────────
           ══════════════════════════════════════════════════════════════ */

        .process-section {
          width: 100%;
          background: var(--black);
          margin-top: 100px;
          position: relative;
          overflow: hidden;
        }
        .process-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--red) 30%, var(--red) 70%, transparent 100%);
        }
        .process-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          box-sizing: border-box;
        }

        /* Header row */
        .process-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 64px 0 48px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .process-header-left {}
        .process-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .process-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: var(--red);
          flex-shrink: 0;
        }

        /* ─── Process SplitText headings ──────────────────────────── */
        .process-main-title-line {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(36px, 5vw, 64px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.025em !important;
          color: #fff !important;
          text-transform: uppercase;
          display: block;
          overflow: visible;
        }
        .process-main-title-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(28px, 4.2vw, 56px) !important;
          color: var(--red) !important;
          line-height: 1 !important;
          letter-spacing: -0.01em !important;
          display: block;
          margin-top: 4px;
          overflow: visible;
        }
        .process-main-title-line [data-roll-unit],
        .process-main-title-accent [data-roll-unit] {
          overflow: hidden;
        }

        .process-header-right {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: #4a4744;
          font-weight: 300;
          max-width: 320px;
          text-align: right;
        }

        /* Cards grid */
        .process-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        .process-cards::before {
          content: '';
          position: absolute;
          top: 88px;
          left: calc(64px / 2);
          right: calc(64px / 2);
          height: 1px;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
          z-index: 0;
        }
        .process-card {
          padding: 48px 36px 52px;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: background 0.4s ease;
        }
        .process-card:last-child { border-right: none; }
        .process-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(200, 55, 45, 0.055);
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .process-card:hover::after { transform: translateY(0); }
        .process-card-top-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }
        .process-card:hover .process-card-top-line { transform: scaleX(1); }
        .process-card > *:not(.process-card-top-line):not(.process-ghost-num) {
          position: relative;
          z-index: 1;
        }
        .process-card-num {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 32px;
        }
        .process-card-num-circle {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(200,55,45,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          letter-spacing: 0;
          color: var(--red);
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s;
        }
        .process-card:hover .process-card-num-circle {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
        }
        .process-card-icon {
          font-size: 22px;
          color: rgba(255,255,255,0.12);
          margin-bottom: 20px;
          display: block;
          line-height: 1;
          transition: color 0.3s;
        }
        .process-card:hover .process-card-icon { color: rgba(200,55,45,0.5); }
        .process-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 26px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1;
          transition: color 0.25s;
        }
        .process-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.8;
          color: #4a4744;
          font-weight: 300;
          transition: color 0.3s;
        }
        .process-card:hover .process-card-desc { color: #ffff; }
        .process-ghost-num {
          position: absolute;
          bottom: -20px;
          right: 8px;
          font-family: 'Anton', sans-serif;
          font-size: 120px;
          line-height: 1;
          color: rgba(255,255,255,0.025);
          pointer-events: none;
          user-select: none;
          z-index: 0;
          letter-spacing: -0.04em;
          transition: color 0.4s;
        }
        .process-card:hover .process-ghost-num { color: rgba(200,55,45,0.06); }

        /* Bottom CTA strip */
        .process-cta-strip {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px 0 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .process-cta-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.06em;
          color: #3a3735;
          font-weight: 300;
        }
        .process-cta-text strong {
          color: #7a7470;
          font-weight: 400;
        }

        /* ─── Scroll reveal ─────────────────────────────────────────── */
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
        [data-reveal][data-d="7"] { transition-delay: 0.86s; }
        .image-stack[data-reveal] { transform: translateY(40px) scale(0.97); }
        .image-stack[data-reveal].revealed { transform: translateY(0) scale(1); }

        /* ════════════════════════════════════════════════════════════
           RESPONSIVE
           ════════════════════════════════════════════════════════════ */
        @media (max-width: 1440px) {
          .about-hero { grid-template-columns: 1fr 500px; }
          .about-body-grid { grid-template-columns: 340px 1fr 280px; gap: 48px; }
        }
        @media (max-width: 1280px) {
          .about-inner { padding: 0 48px; }
          .about::before { left: 48px; right: 48px; }
          .about-hero { grid-template-columns: 1fr 440px; }
          .about-intro-card { margin-left: 40px; padding: 40px 36px 36px; }
          .about-body-grid { grid-template-columns: 300px 1fr 260px; gap: 40px; }
          .card-stat { gap: 32px; }
          .stat-num { font-size: 38px; }
          .process-inner { padding: 0 48px; }
          .process-card { padding: 40px 28px 44px; }
        }
        @media (max-width: 1100px) {
          .about-body-grid { grid-template-columns: 280px 1fr; gap: 40px; }
          .about-right-col { display: none; }
          .about-hero { grid-template-columns: 1fr 400px; }
          .process-cards { grid-template-columns: repeat(2, 1fr); }
          .process-card:nth-child(2) { border-right: none; }
          .process-card:nth-child(3) { border-top: 1px solid rgba(255,255,255,0.05); }
          .process-card:nth-child(4) { border-right: none; border-top: 1px solid rgba(255,255,255,0.05); }
          .process-cards::before { display: none; }
        }
        @media (max-width: 1024px) {
          .about { padding: 80px 0 0; }
          .about-inner { padding: 0 40px; }
          .about::before { left: 40px; right: 40px; }
          .about-label-row { margin-bottom: 40px; }
          .about-hero { grid-template-columns: 1fr; gap: 0; margin-bottom: 64px; }
          .about-intro-card { margin-left: 0; margin-top: 40px; padding: 36px 32px 32px; }
          .about-body-grid { grid-template-columns: 260px 1fr; gap: 36px; }
          .about-right-col { display: none; }
          .process-inner { padding: 0 40px; }
          .process-header { flex-direction: column; align-items: flex-start; gap: 16px; padding-top: 48px; }
          .process-header-right { text-align: left; max-width: 100%; }
          .process-section { margin-top: 80px; }
        }
        @media (max-width: 768px) {
          .about { padding: 64px 0 0; }
          .about-inner { padding: 0 28px; }
          .about::before { left: 28px; right: 28px; }
          .about-label-row { margin-bottom: 32px; }
          .about-hero { grid-template-columns: 1fr; margin-bottom: 48px; }
          .about-intro-card { margin-left: 0; margin-top: 32px; padding: 32px 28px 28px; }
          .about-intro-card p { font-size: 14px; }
          .card-stat { gap: 24px; }
          .stat-num { font-size: 36px; }
          .about-body-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-right-col { display: none; }
          .image-main { aspect-ratio: 4/3; }
          .about-quote-block { padding: 28px 28px; margin: 32px 0; }
          .about-quote-block blockquote { font-size: 19px; }
          .process-inner { padding: 0 28px; }
          .process-cards { grid-template-columns: 1fr; }
          .process-card { border-right: none; border-top: 1px solid rgba(255,255,255,0.05); }
          .process-card:first-child { border-top: none; }
          .process-card { padding: 36px 24px 40px; }
          .process-section { margin-top: 64px; }
          .process-cta-strip { padding: 32px 0 44px; }
        }
        @media (max-width: 600px) {
          .about { padding: 56px 0 0; }
          .about-inner { padding: 0 20px; }
          .about::before { left: 20px; right: 20px; }
          .about-label-row { margin-bottom: 28px; }
          .about-hero { margin-bottom: 40px; }
          .about-intro-card { padding: 28px 24px 24px; margin-top: 28px; }
          .about-intro-card p { font-size: 13.5px; line-height: 1.75; }
          .card-stat { gap: 20px; flex-wrap: nowrap; }
          .stat-num { font-size: 32px; }
          .stat-label { font-size: 9px; }
          .about-paragraph { font-size: 15px; }
          .about-quote-block { padding: 24px 20px; margin: 28px 0; }
          .about-quote-block::before { font-size: 88px; top: -10px; left: 16px; }
          .about-quote-block blockquote { font-size: 17px; line-height: 1.55; }
          .about-tags { gap: 6px; }
          .tag { padding: 7px 13px; }
          .process-inner { padding: 0 20px; }
          .process-card-title { font-size: 22px; }
          .process-ghost-num { font-size: 88px; }
          .process-section { margin-top: 52px; }
        }
        @media (max-width: 480px) {
          .about { padding: 48px 0 0; }
          .about-inner { padding: 0 16px; }
          .about::before { left: 16px; right: 16px; }
          .about-label-row { margin-bottom: 24px; gap: 6px; }
          .about-label, .about-label-right { font-size: 9px; letter-spacing: 0.2em; }
          .about-hero { margin-bottom: 32px; }
          .about-intro-card { padding: 24px 20px 20px; margin-top: 24px; }
          .about-intro-card p { font-size: 13px; margin-bottom: 20px; }
          .card-stat { gap: 16px; padding-top: 20px; }
          .stat-num { font-size: 28px; }
          .about-section-title { font-size: 9px; margin-bottom: 16px; }
          .about-paragraph { font-size: 14px; line-height: 1.78; margin-bottom: 20px; }
          .about-quote-block { padding: 20px 16px; margin: 24px 0; }
          .about-quote-block::before { font-size: 72px; top: -8px; left: 12px; }
          .about-quote-block blockquote { font-size: 16px; }
          .about-quote-block cite { font-size: 9px; margin-top: 14px; }
          .image-main { aspect-ratio: 4/3; }
          .image-caption { font-size: 9px; }
          .process-inner { padding: 0 16px; }
          .process-main-title-line { font-size: 32px !important; }
          .process-main-title-accent { font-size: 26px !important; }
          .process-card { padding: 28px 16px 36px; }
          .process-card-title { font-size: 20px; }
        }
        @media (max-width: 360px) {
          .about-inner { padding: 0 14px; }
          .about-intro-card { padding: 20px 16px 18px; }
          .card-stat { gap: 12px; }
          .stat-num { font-size: 26px; }
          .about-paragraph { font-size: 13.5px; }
          .about-quote-block blockquote { font-size: 15px; }
          .process-inner { padding: 0 14px; }
        }
      `}</style>

      <section className="about" ref={sectionRef}>
        <div className="about-inner">

          {/* Label row */}
          <div className="about-label-row" data-reveal>
            <span className="about-label">21FIFTYONE</span>
            {/* <span className="about-label-right">21FIFTYONE</span> */}
          </div>

          {/* Hero: SplitText headings + dark card */}
          <div className="about-hero">
            <div>
              <SplitText
                text="WE MAKE"
                tag="div"
                className="about-headline"
                delay={45}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                onLetterAnimationComplete={handleAnimationComplete}
                showCallback
                hoverRoll
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
                hoverRollDirection="center"
              />

              <SplitText
                text="Stories"
                tag="div"
                className="about-headline-accent"
                delay={35}
                duration={1.4}
                ease="power4.out"
                splitType="words"
                from={{ opacity: 0, y: 80, skewX: 8 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                hoverRoll
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
                hoverRollDirection="left"
              />
            </div>

            {/* Dark card */}
            <div className="about-intro-card" data-reveal data-d="2">
              <p>
                As a leading video production company in Calicut, we believe every story has the power to inspire, connect, and make an impact. We combine cinematic creativity with modern technology to create films and brand visuals that feel authentic, engaging, and memorable. From concept to completion, every project is crafted with passion, precision, and purpose—transforming ideas into visual experiences that leave a lasting impression.
              </p>
              <div className="card-stat">
                <div>
                  <span className="stat-num">100+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div>
                  <span className="stat-num">25+</span>
                  <span className="stat-label">Brands</span>
                </div>
                <div>
                  <span className="stat-num">10+</span>
                  <span className="stat-label">Studio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body grid */}
          <div className="about-body-grid">

            {/* Image stack */}
            <div className="image-stack" data-reveal data-d="3">
              <div className="image-main">
                <img src="/image/about-4.webp" alt="Studio portrait" />
              </div>
            </div>

            {/* Text column */}
            <div className="about-text-col">
              <p className="about-section-title" data-reveal data-d="3">The Origin</p>
              <p className="about-paragraph" data-reveal data-d="4">
                Founded with a genuine love for storytelling, 21 Fiftyone was created with one simple belief, every idea has the power to become something remarkable. As a leading Video Production Company in Calicut, we bring ideas to life through creative visuals that capture attention, connect with audiences emotionally, and leave a lasting impression.
              </p>
              <p className="about-paragraph" data-reveal data-d="4">
                At 21 Fiftyone, storytelling is at the heart of everything we do. As a trusted Video Production Company, we transform concepts into engaging visual experiences that stand out in a crowded digital world. From brand stories to promotional videos, we create content that resonates with viewers, sparks engagement, and helps brands make a meaningful impact.
              </p>

              <div className="about-quote-block" data-reveal data-d="5">
                <blockquote>
                  &ldquo;We don&rsquo;t just create visuals.
                  We craft stories that stay, long after the moment fades.&rdquo;
                </blockquote>
                <cite>21fifty one</cite>
              </div>
            </div>

            {/* Right col — hidden below 1100px */}
            <div className="about-right-col" data-reveal data-d="4">
              <div className="about-tags" data-reveal data-d="6">
                {["VISUAL PRODUCTION","FILM & CINEMA","BRAND STORYTELLING","AI CONTENT","EVENTS","CREATIVE DIRECTION"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              {/* <p className="about-paragraph" data-reveal data-d="5">
                We blend cinematic storytelling with modern production techniques to craft content that is both visually striking and meaningful.
              </p> */}
              <div className="v-marquee-wrap">
                <div className="v-marquee">
                  {[
                    "VISUAL PRODUCTION","FILM & CINEMA","BRAND STORYTELLING","AI CONTENT","EVENTS","CREATIVE DIRECTION",
                    "VISUAL PRODUCTION","FILM & CINEMA","BRAND STORYTELLING","AI CONTENT","EVENTS","CREATIVE DIRECTION",
                  ].map((brand, i) => (
                    <div key={i} className="v-marquee-item">{brand}</div>
                  ))}
                </div>
              </div>
              <RollButton label="About Us" href="/about" />
            </div>
          </div>

        </div>{/* /.about-inner */}

        {/* ══════════════════════════════════════════════════════
            PROCESS — full-bleed dark section (outside .about-inner)
        ══════════════════════════════════════════════════════ */}
        <div className="process-section">
          <div className="process-inner">

            {/* Header */}
            <div className="process-header" data-reveal>
              <div className="process-header-left">
                <p className="process-eyebrow">How We Work</p>

                {/* ── SplitText: "THE" — chars, Anton, white ── */}
                <SplitText
                  text="THE PROCESS"
                  tag="div"
                  className="process-main-title-line"
                  delay={45}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 50 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-40px"
                  textAlign="left"
                  onLetterAnimationComplete={handleAnimationComplete}
                  showCallback
                  hoverRoll
                  autoRoll
                  autoRollInterval={5500}
                  autoRollDuration={620}
                  hoverRollDirection="center"
                />

                {/* ── SplitText: "Process" — words, Playfair italic, red ── */}
                <SplitText
                  text=""
                  tag="div"
                  className="process-main-title-accent"
                  delay={35}
                  duration={1.4}
                  ease="power4.out"
                  splitType="words"
                  from={{ opacity: 0, y: 60, skewX: 8 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  threshold={0.1}
                  rootMargin="-40px"
                  textAlign="left"
                  hoverRoll
                  autoRoll
                  autoRollInterval={5500}
                  autoRollDuration={620}
                  hoverRollDirection="left"
                />
              </div>

              <p className="process-header-right">
                Every great story starts with a process. From the first spark of an idea to the final delivered frame — here&rsquo;s how we work.
              </p>
            </div>

            {/* Cards */}
            <div className="process-cards">
              {processSteps.map(({ num, title, desc, icon }, i) => (
                <div
                  key={num}
                  className="process-card"
                  data-reveal
                  data-d={String(i + 1)}
                >
                  <span className="process-card-top-line" aria-hidden />
                  <div className="process-card-num">
                    <span className="process-card-num-circle">{num}</span>
                    Step {num}
                  </div>
                  <span className="process-card-icon" aria-hidden>{icon}</span>
                  <h3 className="process-card-title">{title}</h3>
                  <p className="process-card-desc">{desc}</p>
                  <span className="process-ghost-num" aria-hidden>{num}</span>
                </div>
              ))}
            </div>

            {/* Bottom CTA strip */}
            {/* <div className="process-cta-strip" data-reveal>
              <p className="process-cta-text">
                Ready to start your project?&nbsp;&nbsp;
                <strong>Let&rsquo;s build something unforgettable.</strong>
              </p>
              <RollButton label="About Us" href="/projects" />
            </div> */}

          </div>
        </div>

      </section>
    </>
  );
}