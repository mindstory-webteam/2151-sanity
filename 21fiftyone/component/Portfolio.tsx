"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, Tag, ChevronDown } from "lucide-react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const portfolioData: { id: number; category: string; tag: string; link: string; industry: string; type: "reel" | "youtube" }[] = [
  { id: 1,  category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVQrpwIANXE/embed',       industry: 'education&edTech',           type: 'reel' },
  { id: 2,  category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVi55nOkmyT/embed',       industry: 'food&beverage',              type: 'reel' },
  { id: 3,  category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DNQG2Xqu3mt/embed',       industry: 'fashion&lifestyle',          type: 'reel' },
  { id: 4,  category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DNA1pPZBBwV/embed',       industry: 'education&edTech',           type: 'reel' },
  { id: 5,  category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DPnwmaxkpAU/embed',       industry: 'fitness&wellness',           type: 'reel' },
  { id: 6,  category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVOHXbygZ2r/embed',       industry: 'construction&infrastructure',type: 'reel' },
  { id: 7,  category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVm8K9aEbB3/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 8,  category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVX7h5NgBdT/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 9,  category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DSXXbLnEtaR/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 10, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DRhQd4HAq3K/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 11, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DRg_FYkgfOM/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 12, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DP_hdXQEr44/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 13, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DP88tYrElXF/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 14, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DP3sCZNkoxV/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 15, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DPyXF0fk5Jc/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 16, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DPqza85kv6P/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 17, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DNksUrORT3K/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 18, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DNkqvB-PsHZ/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 19, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DJgz9DdIvsR/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 20, category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVu0-P6CSbl/embed',       industry: 'construction&infrastructure',type: 'reel' },
  { id: 21, category: 'anchor',    tag: 'Anchor',    link: 'https://www.instagram.com/reel/DUVgvG9j8io/embed',       industry: 'corporate&enterprises',      type: 'reel' },
  { id: 22, category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DSFc2Q-DgTU/embed',       industry: 'manufacturing',              type: 'reel' },
  { id: 23, category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVipfE0D_o0/embed',       industry: 'fashion&lifestyle',          type: 'reel' },
  { id: 24, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DR1xECgD1yJ/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 25, category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DSpwAXMkjnM/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 26, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DSXXbLnEtaR/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 27, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DFXPfWbs3sB/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 28, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DH-_fAIJcL1/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 29, category: 'ai',        tag: 'AI',        link: 'https://www.instagram.com/reel/DVDQfoWkkbH/embed',       industry: 'entertainment&media',        type: 'reel' },
  { id: 30, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DR3z_zflY_K/embed',       industry: 'automobile',                 type: 'reel' },
  { id: 31, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DRJ1aPfEdlL/embed',       industry: 'food&beverage',              type: 'reel' },
  { id: 32, category: 'concept',   tag: 'Concept',   link: 'https://www.youtube.com/embed/QjRnmIeut9w',              industry: 'entertainment&media',        type: 'youtube' },
  { id: 33, category: 'interview', tag: 'Interview', link: 'https://www.youtube.com/embed/kQn_NSt1AxQ',              industry: 'entertainment&media',        type: 'youtube' },
   { id: 34, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DWgx8m3CU1b/embed',         industry: 'entertainment&media',        type: 'reel' },
   { id: 34, category: 'concept',   tag: 'Concept',   link: 'https://www.instagram.com/reel/DWWd9v-zcDy/embed',         industry: 'entertainment&media',        type: 'reel' },
];

const industries = [
  { label: 'All Industries',            value: 'all' },
  { label: 'Healthcare & Hospitals',    value: 'healthcare&hospitals' },
  { label: 'Education & EdTech',        value: 'education&edTech' },
  { label: 'Real Estate',               value: 'realestate' },
  { label: 'Finance & FinTech',         value: 'finance&finTech' },
  { label: 'Technology / SaaS',         value: 'technology&saaS' },
  { label: 'E-commerce',                value: 'ecommerce' },
  { label: 'Retail Brands',             value: 'retailbrands' },
  { label: 'Tourism & Hospitality',     value: 'tourism&hospitality' },
  { label: 'Automobile',                value: 'automobile' },
  { label: 'Fashion & Lifestyle',       value: 'fashion&lifestyle' },
  { label: 'Food & Beverage',           value: 'food&beverage' },
  { label: 'Corporate / Enterprises',   value: 'corporate&enterprises' },
  { label: 'NGOs & Non-profits',        value: 'ngos&non-profits' },
  { label: 'Government & Public Sector',value: 'government&publicsector' },
  { label: 'Entertainment & Media',     value: 'entertainment&media' },
  { label: 'Fitness & Wellness',        value: 'fitness&wellness' },
  { label: 'Beauty & Cosmetics',        value: 'beauty&cosmetics' },
  { label: 'Construction & Infrastructure', value: 'construction&infrastructure' },
  { label: 'Manufacturing',             value: 'manufacturing' },
];

const categories = [
  { label: 'AI',               value: 'ai' },
  { label: 'Anchor / Presenter',value: 'anchor' },
  { label: 'Testimonials',     value: 'testimonial' },
  { label: 'Podcast',          value: 'podcast' },
  { label: 'Concept',          value: 'concept' },
  { label: 'Explainer',        value: 'explainer' },
  { label: 'Product',          value: 'product' },
  { label: 'Campaign',         value: 'campaign' },
  { label: 'Educational',      value: 'educational' },
  { label: 'Interview',        value: 'interview' },
];

/* ─────────────────────────────────────────────────────────────
   MASONRY GRID
   Reels  → portrait  9:16  (tall)
   YouTube → landscape 16:9 (wide, spans 2 cols)
───────────────────────────────────────────────────────────── */
const GAP = 16;
const COLS = 3; // desktop column count for reels

interface MasonryItem {
  id: number;
  tag: string;
  industry: string;
  link: string;
  type: "reel" | "youtube";
  
  x: number;
  y: number;
  w: number;
  h: number; // iframe area height (without footer)
}

function buildMasonry(items: typeof portfolioData, containerW: number): MasonryItem[] {
  if (!containerW) return [];

  const totalGaps = (COLS - 1) * GAP;
  const colW = (containerW - totalGaps) / COLS;
  const colHeights = new Array(COLS).fill(0);

  const FOOTER_H = 44; // card footer height
  // portrait reel: 9:16 ratio minus the clipped instagram UI
  const REEL_IFRAME_H = (colW / 9) * 16 * 0.72; // visible video area
  // youtube landscape: 16:9
  const YT_IFRAME_H = ((colW * 2 + GAP) / 16) * 9;

  const result: MasonryItem[] = [];

  for (const item of items) {
    if (item.type === 'youtube') {
      // Find the two adjacent columns where placing gives the least max height
      let bestCol = 0;
      let bestMax = Infinity;
      for (let c = 0; c <= COLS - 2; c++) {
        const maxH = Math.max(colHeights[c], colHeights[c + 1]);
        if (maxH < bestMax) { bestMax = maxH; bestCol = c; }
      }

      const x = bestCol * (colW + GAP);
      const y = Math.max(colHeights[bestCol], colHeights[bestCol + 1]);
      const w = colW * 2 + GAP;
      const totalH = YT_IFRAME_H + FOOTER_H;

      colHeights[bestCol]     = y + totalH + GAP;
      colHeights[bestCol + 1] = y + totalH + GAP;

      result.push({ ...item, x, y, w, h: YT_IFRAME_H });
    } else {
      // shortest column
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x   = col * (colW + GAP);
      const y   = colHeights[col];
      const totalH = REEL_IFRAME_H + FOOTER_H;

      colHeights[col] = y + totalH + GAP;
      result.push({ ...item, x, y, w: colW, h: REEL_IFRAME_H });
    }
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO SECTION
───────────────────────────────────────────────────────────── */
const Portfolio = () => {
  const [filter, setFilter]                       = useState("all");
  const [industryFilter, setIndustryFilter]       = useState("all");
  const [showIndustrySheet, setShowIndustrySheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [canScrollLeft, setCanScrollLeft]         = useState(false);
  const [canScrollRight, setCanScrollRight]       = useState(false);
  const [industryOpen, setIndustryOpen]           = useState(false);
  const [containerW, setContainerW]               = useState(0);
  const [visible, setVisible]                     = useState<number[]>([]);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const gridWrapRef  = useRef<HTMLDivElement>(null);

  /* measure grid container */
  useLayoutEffect(() => {
    if (!gridWrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    ro.observe(gridWrapRef.current);
    setContainerW(gridWrapRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  /* scroll-arrow state */
  const checkScroll = () => {
    const el = scrollRef.current; if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIndustryOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const filteredData = portfolioData.filter((item) =>
    (filter === "all" || item.category === filter) &&
    (industryFilter === "all" || item.industry === industryFilter)
  );

  /* staggered card entrance */
  useEffect(() => {
    setVisible([]);
    const t = setTimeout(() => {
      filteredData.forEach((_, i) => {
        setTimeout(() => setVisible((p) => [...p, i]), i * 55);
      });
    }, 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, industryFilter]);

  /* masonry layout */
  const grid = useMemo(
    () => buildMasonry(filteredData as typeof portfolioData, containerW),
    [filteredData, containerW]
  );

  /* total canvas height */
  const canvasH = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map(item => item.y + item.h + 44)) ; // +footer
  }, [grid]);

  const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  const activeIndustryLabel = industries.find((i) => i.value === industryFilter)?.label ?? "All Industries";
  const activeCategoryLabel = filter === "all" ? "All Works" : categories.find((c) => c.value === filter)?.label ?? "All Works";

  return (
    <section className="pf" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --cream:#f2ede6; --black:#0c0c0c; --red:#c8372d; --muted:#8a8480; --line:rgba(12,12,12,0.12); }

        .pf { width:100%; background:var(--cream); overflow:visible; position:relative; padding-bottom:120px; }

        /* HEADER */
        .pf-hdr { max-width:1280px; margin:0 auto; padding:100px 80px 56px; display:flex; justify-content:space-between; align-items:flex-end; gap:40px; overflow:visible; border-bottom:1px solid var(--line); }
        .pf-hdr-left { overflow:visible; flex:1; min-width:0; }
        .pf-eyebrow { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.32em; text-transform:uppercase; color:var(--red); display:block; margin-bottom:16px; }
        .pf-h1 { font-family:'Anton',sans-serif !important; font-size:clamp(48px,7vw,104px) !important; line-height:0.88 !important; letter-spacing:-0.01em !important; color:var(--black) !important; text-transform:uppercase; display:block !important; overflow:visible !important; padding-left:6px !important; margin-left:-6px !important; padding-right:6px !important; padding-top:10px !important; padding-bottom:6px !important; }
        .pf-h1 > div { overflow:visible !important; }
        .pf-h1-accent { font-family:'Playfair Display',serif !important; font-style:italic !important; font-size:clamp(40px,5.8vw,88px) !important; color:var(--red) !important; line-height:0.95 !important; letter-spacing:-0.01em !important; display:block !important; overflow:visible !important; padding-left:6px !important; margin-left:-6px !important; margin-top:-0.04em; padding-bottom:6px !important; }
        .pf-h1-accent > div { overflow:visible !important; }
        .pf-hdr-desc { font-family:'DM Sans',sans-serif; font-size:15px; line-height:1.82; color:#5a5450; font-weight:300; max-width:500px; margin-top:24px; }
        .pf-hdr-right { display:flex; flex-direction:column; align-items:flex-end; gap:16px; padding-bottom:8px; flex-shrink:0; }
        .pf-count { font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); }
        .pf-count strong { font-family:'Anton',sans-serif; font-size:16px; color:var(--red); margin-right:4px; }

        /* FILTER BAR */
        .pf-bar { max-width:1280px; margin:0 auto; padding:0 80px; position:sticky; top:0; z-index:30; background:var(--cream); border-bottom:1px solid var(--line); }
        .pf-bar-inner { display:flex; align-items:center; gap:0; padding:18px 0; }
        .pf-arr { width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid var(--line); background:transparent; color:var(--muted); cursor:pointer; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .pf-arr:hover:not(:disabled) { background:var(--black); color:#fff; border-color:var(--black); }
        .pf-arr:disabled { opacity:0.2; cursor:default; }
        .pf-pill { flex-shrink:0; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.24em; text-transform:uppercase; padding:8px 18px; border:1px solid transparent; background:transparent; color:var(--muted); cursor:pointer; white-space:nowrap; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .pf-pill:hover { color:var(--black); border-color:var(--line); }
        .pf-pill.active { background:var(--black); color:#fff; border-color:var(--black); }
        .pf-scroll { flex:1; display:flex; align-items:center; gap:4px; overflow-x:auto; scroll-behavior:smooth; scrollbar-width:none; padding:0 4px; }
        .pf-scroll::-webkit-scrollbar { display:none; }
        .pf-ind-wrap { position:relative; flex-shrink:0; margin-left:8px; }
        .pf-ind-btn { display:flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.22em; text-transform:uppercase; padding:8px 16px; border:1px solid var(--line); background:transparent; color:var(--black); cursor:pointer; white-space:nowrap; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .pf-ind-btn.open,.pf-ind-btn:hover { background:var(--black); color:#fff; border-color:var(--black); }
        .pf-ind-btn svg { color:var(--muted); transition:color 0.2s,transform 0.25s; }
        .pf-ind-btn:hover svg,.pf-ind-btn.open svg { color:#fff; }
        .pf-ind-btn.open .pf-chevron { transform:rotate(180deg); }
        .pf-ind-dot { width:6px; height:6px; border-radius:50%; background:var(--red); flex-shrink:0; }
        .pf-drop { position:absolute; top:calc(100% + 6px); right:0; min-width:240px; background:var(--black); border:1px solid rgba(255,255,255,0.08); z-index:100; max-height:320px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--red) transparent; box-shadow:0 24px 48px rgba(0,0,0,0.4); opacity:0; transform:translateY(8px); pointer-events:none; transition:opacity 0.2s,transform 0.2s; }
        .pf-drop.open { opacity:1; transform:translateY(0); pointer-events:auto; }
        .pf-drop-item { display:block; width:100%; text-align:left; padding:12px 20px; font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.4); background:transparent; border:none; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:color 0.15s,background 0.15s; }
        .pf-drop-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .pf-drop-item.active { color:var(--red); }

        /* CHIPS */
        .pf-chips { max-width:1280px; margin:0 auto; padding:16px 80px 0; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .pf-chip-label { font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:var(--muted); }
        .pf-chip { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line); padding:5px 12px; font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--black); background:transparent; cursor:pointer; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .pf-chip:hover { background:var(--red); color:#fff; border-color:var(--red); }

        /* MASONRY WRAPPER */
        .pf-wrap { max-width:1280px; margin:0 auto; padding:36px 80px 0; }
        .pf-canvas { position:relative; width:100%; }

        /* MASONRY CARD */
        .pf-card {
          position:absolute;
          background:#ece7df;
          overflow:hidden;
          opacity:0;
          transform:translateY(20px);
          transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1),
                      transform 0.5s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s ease;
        }
        .pf-card.vis { opacity:1; transform:translateY(0); }
        .pf-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:10; }
        .pf-card:hover .pf-card-shade { opacity:1; }
        .pf-card-shade { position:absolute; inset:0; background:rgba(12,12,12,0.05); z-index:2; opacity:0; transition:opacity 0.3s; pointer-events:none; }

        /* red accent top bar */
        .pf-card::before {
          content:''; position:absolute; top:0; left:0;
          width:3px; height:44px; background:var(--red); z-index:3;
        }

        /* IFRAME — reel (portrait 9:16) */
        .pf-iframe { position:relative; width:100%; overflow:hidden; background:var(--black); }
        .pf-iframe.reel iframe {
          position:absolute;
          top:-55px; left:0;
          width:100%;
          height:calc(100% + 140px);
          border:none;
        }
        /* IFRAME — youtube (landscape 16:9) */
        .pf-iframe.yt iframe {
          position:absolute;
          top:0; left:0;
          width:100%; height:100%;
          border:none;
        }

        /* CARD FOOTER */
        .pf-card-foot { padding:12px 16px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); background:#ece7df; }
        .pf-card-tag { font-family:'Anton',sans-serif; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--red); }
        .pf-card-ind { font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); text-align:right; max-width:180px; }

        /* EMPTY */
        .pf-empty { text-align:center; padding:80px 0; }
        .pf-empty-h { font-family:'Anton',sans-serif; font-size:32px; letter-spacing:0.04em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
        .pf-empty-p { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--muted); letter-spacing:0.1em; margin-bottom:32px; }

        /* MOBILE BAR */
        .pf-mob-bar { display:none; position:fixed; bottom:16px; left:16px; right:16px; z-index:50; background:rgba(12,12,12,0.96); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(12px); }
        .pf-mob-inner { display:flex; align-items:center; }
        .pf-mob-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:14px 12px; font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.5); background:transparent; border:none; cursor:pointer; transition:color 0.2s; overflow:hidden; }
        .pf-mob-btn:first-child { border-right:1px solid rgba(255,255,255,0.08); }
        .pf-mob-btn:hover { color:#fff; }
        .pf-mob-btn svg { color:var(--red); flex-shrink:0; }
        .pf-mob-btn span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px; }

        /* SHEET */
        .pf-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.72); backdrop-filter:blur(4px); z-index:60; opacity:0; transition:opacity 0.3s; pointer-events:none; }
        .pf-overlay.open { opacity:1; pointer-events:auto; }
        .pf-sheet { position:fixed; bottom:0; left:0; right:0; background:var(--black); z-index:70; border-top:3px solid var(--red); transform:translateY(100%); transition:transform 0.35s cubic-bezier(0.16,1,0.3,1); max-height:72vh; display:flex; flex-direction:column; }
        .pf-sheet.open { transform:translateY(0); }
        .pf-sheet-handle { display:flex; justify-content:center; padding:12px 0 0; }
        .pf-sheet-handle span { width:36px; height:3px; background:rgba(255,255,255,0.12); border-radius:2px; }
        .pf-sheet-head { display:flex; justify-content:space-between; align-items:center; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .pf-sheet-head h3 { font-family:'Anton',sans-serif; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; color:#fff; }
        .pf-sheet-x { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.4); cursor:pointer; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .pf-sheet-x:hover { background:var(--red); color:#fff; border-color:var(--red); }
        .pf-sheet-body { overflow-y:auto; padding:12px 20px 40px; display:flex; flex-direction:column; gap:3px; }
        .pf-sheet-item { width:100%; text-align:left; padding:13px 16px; font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.4); background:transparent; border:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:color 0.15s,background 0.15s,border-color 0.15s; }
        .pf-sheet-item:hover { color:#fff; background:rgba(255,255,255,0.04); }
        .pf-sheet-item.active { color:#fff; background:var(--red); border-color:var(--red); }

        /* REVEAL */
        [data-reveal] { opacity:0; transform:translateY(24px); transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        [data-reveal].revealed { opacity:1; transform:translateY(0); }
        [data-reveal][data-d="1"] { transition-delay:0.08s; }
        [data-reveal][data-d="2"] { transition-delay:0.18s; }
        [data-reveal][data-d="3"] { transition-delay:0.28s; }

        /* RESPONSIVE */
        @media (max-width:1100px) {
          .pf-hdr,.pf-bar,.pf-chips,.pf-wrap { padding-left:48px; padding-right:48px; }
        }
        @media (max-width:768px) {
          .pf-hdr { flex-direction:column; align-items:flex-start; padding:60px 28px 40px; }
          .pf-hdr-right { align-items:flex-start; }
          .pf-bar { display:none; }
          .pf-chips { padding:14px 28px 0; }
          .pf-wrap { padding:24px 20px 0; }
          .pf-mob-bar { display:block; }
          .pf { padding-bottom:100px; }
        }
        @media (max-width:480px) {
          .pf-hdr { padding:48px 20px 32px; }
          .pf-chips { padding:12px 20px 0; }
          .pf-wrap { padding:16px 12px 0; }
        }
      `}</style>

      {/* ══ HEADER ══ */}
      <div className="pf-hdr">
        <div className="pf-hdr-left">
          <span className="pf-eyebrow" data-reveal>VISUAL PRODUCTION</span>
          <SplitText text="Our Best" tag="div" className="pf-h1" delay={38} duration={1.2} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 70 }} to={{ opacity: 1, y: 0 }} threshold={0.05} rootMargin="-20px" textAlign="left" hoverRoll hoverRollDirection="center" autoRoll
            autoRollInterval={5500}
            autoRollDuration={620} />
          <SplitText text="Work." tag="div" className="pf-h1-accent" delay={30} duration={1.4} ease="power4.out" splitType="chars" from={{ opacity: 0, y: 80, skewX: 6 }} to={{ opacity: 1, y: 0, skewX: 0 }} threshold={0.05} rootMargin="-20px" textAlign="left" hoverRoll hoverRollDirection="left" autoRoll
            autoRollInterval={5500}
            autoRollDuration={620} />
          <p className="pf-hdr-desc" data-reveal data-d="1">
           A curated selection of our finest visual productions—crafted with precision, driven by storytelling, and designed to elevate every brand we collaborate with
          </p>
        </div>
        <div className="pf-hdr-right" data-reveal data-d="2">
          <p className="pf-count"><strong>{filteredData.length.toString().padStart(2, "0")}</strong> Works</p>
          <RollButton label="All Projects" href="/work" />
        </div>
      </div>

      {/* ══ FILTER BAR ══ */}
      <div className="pf-bar">
        <div className="pf-bar-inner">
          <button className="pf-arr" onClick={() => scroll(-1)} disabled={!canScrollLeft}><ChevronLeft size={14} /></button>
          <button className={`pf-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")} style={{ marginRight: 4 }}>All Works</button>
          <div className="pf-scroll" ref={scrollRef}>
            {categories.map((cat) => (
              <button key={cat.value} className={`pf-pill ${filter === cat.value ? "active" : ""}`} onClick={() => setFilter(cat.value)}>{cat.label}</button>
            ))}
          </div>
          <button className="pf-arr" onClick={() => scroll(1)} disabled={!canScrollRight}><ChevronRight size={14} /></button>
          <div className="pf-ind-wrap" ref={dropdownRef}>
            <button className={`pf-ind-btn ${industryOpen ? "open" : ""}`} onClick={() => setIndustryOpen((v) => !v)}>
              {industryFilter !== "all" && <span className="pf-ind-dot" />}
              <SlidersHorizontal size={12} />
              <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{activeIndustryLabel}</span>
              <ChevronDown size={12} className="pf-chevron" />
            </button>
            <div className={`pf-drop ${industryOpen ? "open" : ""}`}>
              {industries.map((ind) => (
                <button key={ind.value} className={`pf-drop-item ${industryFilter === ind.value ? "active" : ""}`} onClick={() => { setIndustryFilter(ind.value); setIndustryOpen(false); }}>{ind.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CHIPS ══ */}
      {(filter !== "all" || industryFilter !== "all") && (
        <div className="pf-chips">
          <span className="pf-chip-label">Filtering:</span>
          {filter !== "all" && <button className="pf-chip" onClick={() => setFilter("all")}>{activeCategoryLabel} <X size={9} /></button>}
          {industryFilter !== "all" && <button className="pf-chip" onClick={() => setIndustryFilter("all")}>{activeIndustryLabel} <X size={9} /></button>}
        </div>
      )}

      {/* ══ MASONRY GRID ══ */}
      <div className="pf-wrap">
        {filteredData.length === 0 ? (
          <div className="pf-empty">
            <p className="pf-empty-h">No Works Found</p>
            <p className="pf-empty-p">Try a different category or industry combination.</p>
            <RollButton label="Clear Filters" href="#" onClick={() => { setFilter("all"); setIndustryFilter("all"); }} />
          </div>
        ) : (
          <div ref={gridWrapRef} className="pf-canvas" style={{ height: canvasH }}>
            {grid.map((item, i) => (
              <div
                key={item.id}
                className={`pf-card ${visible.includes(i) ? "vis" : ""}`}
                style={{
                  left: item.x,
                  top:  item.y,
                  width: item.w,
                  transitionDelay: `${i * 0.04}s`,
                }}
              >
                <div className="pf-card-shade" />

                {/* ── iframe area ── */}
                <div
                  className={`pf-iframe ${item.type === 'youtube' ? 'yt' : 'reel'}`}
                  style={{ height: item.h }}
                >
                  <iframe
                    src={item.link}
                    scrolling="no"
                    allowFullScreen
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>

                {/* ── footer ── */}
                <div className="pf-card-foot">
                  <span className="pf-card-tag">{item.tag}</span>
                  <span className="pf-card-ind">{item.industry.replace(/&/g, " & ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ MOBILE BOTTOM BAR ══ */}
      <div className="pf-mob-bar">
        <div className="pf-mob-inner">
          <button className="pf-mob-btn" onClick={() => setShowCategorySheet(true)}><Tag size={11} /><span>{activeCategoryLabel}</span><ChevronDown size={11} /></button>
          <button className="pf-mob-btn" onClick={() => setShowIndustrySheet(true)}><SlidersHorizontal size={11} /><span>{activeIndustryLabel}</span><ChevronDown size={11} /></button>
        </div>
      </div>

      {/* ══ CATEGORY SHEET ══ */}
      <div className={`pf-overlay ${showCategorySheet ? "open" : ""}`} onClick={() => setShowCategorySheet(false)} />
      <div className={`pf-sheet ${showCategorySheet ? "open" : ""}`}>
        <div className="pf-sheet-handle"><span /></div>
        <div className="pf-sheet-head"><h3>Category</h3><button className="pf-sheet-x" onClick={() => setShowCategorySheet(false)}><X size={13} /></button></div>
        <div className="pf-sheet-body">
          <button className={`pf-sheet-item ${filter === "all" ? "active" : ""}`} onClick={() => { setFilter("all"); setShowCategorySheet(false); }}>All Works</button>
          {categories.map((cat) => <button key={cat.value} className={`pf-sheet-item ${filter === cat.value ? "active" : ""}`} onClick={() => { setFilter(cat.value); setShowCategorySheet(false); }}>{cat.label}</button>)}
        </div>
      </div>

      {/* ══ INDUSTRY SHEET ══ */}
      <div className={`pf-overlay ${showIndustrySheet ? "open" : ""}`} onClick={() => setShowIndustrySheet(false)} />
      <div className={`pf-sheet ${showIndustrySheet ? "open" : ""}`}>
        <div className="pf-sheet-handle"><span /></div>
        <div className="pf-sheet-head"><h3>Industry</h3><button className="pf-sheet-x" onClick={() => setShowIndustrySheet(false)}><X size={13} /></button></div>
        <div className="pf-sheet-body">
          {industries.map((ind) => <button key={ind.value} className={`pf-sheet-item ${industryFilter === ind.value ? "active" : ""}`} onClick={() => { setIndustryFilter(ind.value); setShowIndustrySheet(false); }}>{ind.label}</button>)}
        </div>
      </div>

    </section>
  );
};

export default Portfolio;