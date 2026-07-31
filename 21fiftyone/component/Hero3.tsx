"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import SplitText from "./Splittext"; // ← external import

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════
   SINGLE VIDEO
═══════════════════════════════════════════ */
const VIDEO_SRC = "/videos/video-1.webm";

/* ═══════════════════════════════════════════
   BUG SVG
═══════════════════════════════════════════ */
const BugIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.28 244.89" width="64" height="64" aria-hidden>
    <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52l.13,39.47c0,1.28,2.05,1.27,2.04,0l-.13-39.47c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M120.62,133.05c-3.28-1.05-6.78.75-7.84,4.03-1.05,3.27.75,6.78,4.03,7.84,3.28,1.05,6.78-.75,7.84-4.03,1.05-3.28-.75-6.78-4.03-7.84h0Z" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M140.93,129.07c-1.05,3.27-4.56,5.08-7.84,4.03-3.28-1.05-5.08-4.56-4.03-7.84,1.05-3.27,4.56-5.08,7.84-4.03,3.28,1.05,5.08,4.56,4.03,7.84h0Z" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M96.43,129.21c-1.08-3.27.7-6.79,3.97-7.86,3.27-1.07,6.79.71,7.86,3.97,1.08,3.27-.7,6.79-3.97,7.86-3.27,1.07-6.79-.71-7.86-3.97h0Z" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M104.84,103.03c2.78-2.03,6.67-1.43,8.7,1.35,2.03,2.78,1.43,6.67-1.35,8.71-2.78,2.03-6.67,1.43-8.7-1.35-2.03-2.78-1.43-6.67,1.35-8.7h0Z" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M132.35,102.94c2.79,2.01,3.42,5.9,1.41,8.69-2.02,2.79-5.91,3.42-8.7,1.41-2.79-2.02-3.42-5.91-1.41-8.7,2.01-2.79,5.91-3.42,8.69-1.41h0Z" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M118.5,73.16c2.04,0,4,.42,5.8,1.2.64.28,1.38.03,1.73-.58.48-.86,1.17-1.6,2.04-2.13.92-.57,1.96-.87,3-.89.13,0,.27,0,.41,0,.46.02.87-.07,1.28-.29.28-.15.6-.24.94-.24,1.1,0,1.99.88,2,1.99s-.89,1.99-1.99,1.99c-.77,0-1.44-.43-1.77-1.07-.28-.53-.83-.81-1.42-.72-.56.09-1.09.29-1.59.59-.67.41-1.19.99-1.54,1.66,0,.01-.01.02-.02.04-.3.59-.14,1.28.37,1.69,2.94,2.31,5.03,5.65,5.63,9.34.27,1.68-1.22,2.99-2.78,2.34-3.73-1.57-7.79-2.43-12.05-2.42s-8.32.9-12.03,2.49c-1.57.67-3.06-.64-2.8-2.32.57-3.69,2.65-7.05,5.57-9.37.51-.41.66-1.11.36-1.69,0-.01-.01-.02-.02-.04-.35-.67-.88-1.24-1.55-1.65-.49-.3-1.04-.5-1.59-.58-.59-.09-1.14.19-1.41.72-.33.64-1,1.07-1.76,1.08-1.1,0-1.99-.88-1.99-1.98s.88-1.99,1.98-2c.34,0,.66.08.94.23.41.22.82.31,1.28.28.14,0,.28-.01.41,0,1.04.02,2.08.31,3.01.87.87.53,1.57,1.27,2.06,2.12.35.61,1.09.85,1.73.57,1.79-.79,3.76-1.23,5.79-1.24h0Z" style={{ fill: "#fff", fillRule: "evenodd" }} />
    <path d="M119.58,90.1c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52" style={{ fill: "#e41e26", fillRule: "evenodd" }} />
    <path d="M113.63,104.32c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{ fill: "black", fillRule: "evenodd" }} />
    <path d="M133.81,104.25c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.43-6.03,1.37-8.85h0Z" style={{ fill: "black", fillRule: "evenodd" }} />
    <path d="M140.11,123.42c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.43,6.03-1.37,8.85,2.07,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{ fill: "black", fillRule: "evenodd" }} />
    <path d="M123.82,135.24c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.06-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.06,3.43-6.03,1.37-8.85h0Z" style={{ fill: "black", fillRule: "evenodd" }} />
    <path d="M107.46,123.53c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{ fill: "black", fillRule: "evenodd" }} />
  </svg>
);

/* ═══════════════════════════════════════════
   ROLL LABEL
═══════════════════════════════════════════ */
const RBSTAGGER = 0.028;
const RollLabel = ({ children, isHovered }: { children: string; isHovered: boolean }) => {
  const chars = children.split("");
  return (
    <span style={{ position: "relative", display: "inline-block", overflow: "hidden", lineHeight: 1, verticalAlign: "top" }}>
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span key={i} animate={isHovered ? { y: "-100%" } : { y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.36, delay: RBSTAGGER * i }}
            style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span key={i} animate={isHovered ? { y: 0 } : { y: "100%" }}
            transition={{ ease: "easeInOut", duration: 0.36, delay: RBSTAGGER * i }}
            style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </span>
  );
};

/* ═══════════════════════════════════════════
   ROLL BUTTON
═══════════════════════════════════════════ */
const RollButton = ({ label, href }: { label: string; href?: string }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const inner = (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center",
        padding: "6px 10px 6px 10px", borderRadius: "4px",
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        fontSize: "9px", fontWeight: 600, letterSpacing: "0.36em",
        textTransform: "uppercase", overflow: "hidden",
        textDecoration: "none", userSelect: "none", outline: "none",
        background: "", color: "var(--cream)",
        border: "2px solid rgba(200,55,45,0.4)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <span style={{ position: "relative", display: "flex", alignItems: "center",
        width: 55, height: 34, flexShrink: 0, overflow: "hidden", marginRight: 2 }}>
        <motion.span
          animate={isHovered ? { x: [0, 54, -54, 0] } : { x: 0 }}
          transition={isHovered
            ? { duration: 0.68, ease: [0.16, 1, 0.3, 1], times: [0, 0.44, 0.45, 1] }
            : { duration: 0.36, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", rotate: "90deg" }}>
          <BugIcon />
        </motion.span>
      </span>
      <span style={{ width: 1, height: 20, background: "rgba(242,237,230,0.25)",
        flexShrink: 0, margin: "0 12px", borderRadius: 1 }} />
      <RollLabel isHovered={isHovered}>{label}</RollLabel>
    </motion.span>
  );
  if (href) return <a href={href} style={{ textDecoration: "none" }}>{inner}</a>;
  return <button type="button" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>{inner}</button>;
};

/* ═══════════════════════════════════════════
   3-D TILT WRAPPER
═══════════════════════════════════════════ */
const VideoPreview = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    gsap.to(el, {
      rotateY: ((e.clientX - left) / width  - 0.5) * 14,
      rotateX: ((e.clientY - top)  / height - 0.5) * -14,
      duration: 0.28, ease: "power1.out", transformPerspective: 900, overwrite: "auto",
    });
  }, []);
  const onLeave = useCallback(() =>
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.65, ease: "power3.out", overwrite: "auto" }), []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
export default function Hero3() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasClicked,   setHasClicked]   = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const heroRef     = useRef<HTMLDivElement>(null);
  const bgVdRef     = useRef<HTMLVideoElement>(null);
  const nextVdRef   = useRef<HTMLVideoElement>(null);
  const miniVdRef   = useRef<HTMLVideoElement>(null);
  const miniCardRef = useRef<HTMLDivElement>(null);
  const miniHintRef = useRef<HTMLDivElement>(null);

  const SLIDES_COUNT = 1;
  const slides = [
    {
      eyebrow: "",
      line1: "WE", line2: "CREATE", accent: "Visual",
      sub: "A creative production house crafting cinematic stories, brand films, and digital content that captivate, connect, and leave a lasting impression.",
      cta: "Contact Us",
    },
  ];
  const slide = slides[currentIndex % SLIDES_COUNT];

  const miniCardInitStyle: React.CSSProperties = { opacity: 0, transform: "scale(0.9) translateY(16px)" };

  const handleMiniClick = useCallback(() => {
    setHasClicked(true);
    setCurrentIndex(p => (p + 1) % SLIDES_COUNT);
  }, []);

  const handleEnter = useCallback(() => {
    setIsHovered(true);
    gsap.to(miniCardRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    gsap.to(miniHintRef.current, { opacity: 0, duration: 0.25, overwrite: "auto" });
  }, []);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    gsap.to(miniCardRef.current, { opacity: 0, scale: 0.9, y: 16, duration: 0.38, ease: "power2.in", overwrite: "auto" });
    gsap.to(miniHintRef.current, { opacity: 1, duration: 0.4, delay: 0.1, overwrite: "auto" });
  }, []);

  /* Mini preview */
  useEffect(() => {
    const mv = miniVdRef.current;
    if (!mv) return;
    mv.src = VIDEO_SRC;
    mv.load();
    mv.play().catch(() => {});
  }, []);

  /* Slide transition */
  useEffect(() => {
    if (!hasClicked) return;
    const nv = nextVdRef.current;
    const bg = bgVdRef.current;
    if (!nv) return;

    nv.src = VIDEO_SRC;
    nv.load();

    gsap.set(nv, {
      visibility: "visible",
      width: 240, height: 240,
      xPercent: -50, yPercent: -50,
      top: "50%", left: "50%",
      clearProps: "none",
    });

    const tl = gsap.timeline();
    tl.to(nv, {
      width: "100%", height: "100%",
      xPercent: 0, yPercent: 0,
      top: 0, left: 0,
      duration: 0.95,
      ease: "power2.inOut",
      onStart() { nv.play().catch(() => {}); },
      onComplete() {
        if (bg) { bg.src = VIDEO_SRC; bg.load(); bg.play().catch(() => {}); }
        gsap.set(nv, { visibility: "hidden", clearProps: "width,height,top,left,xPercent,yPercent" });
      },
    });

    return () => { tl.kill(); };
  }, [currentIndex, hasClicked]);

  /* Scroll clip path */
  useEffect(() => {
    const frame = heroRef.current?.querySelector<HTMLElement>("#video-frame");
    if (!frame) return;
    gsap.set(frame, { clipPath: "polygon(14% 0,72% 0,88% 90%,0 95%)", borderRadius: "0% 0% 40% 10%" });
    const st = ScrollTrigger.create({
      trigger: frame,
      start: "center center",
      end: "bottom center",
      scrub: true,
      animation: gsap.from(frame, {
        clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
      }),
    });
    return () => { st.kill(); };
  }, []);

  /* Slide text entrance */
  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>(".hero-text-item");
    if (!items.length) return;
    const tl = gsap.timeline();
    tl.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.72, ease: "power3.out", stagger: 0.09 });
    return () => { tl.kill(); };
  }, [currentIndex]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root { --cream:#f2ede6; --black:#0c0c0c; --red:#c8372d; }

        .d-h1 {
          font-family:'Anton',sans-serif !important;
          font-size:clamp(72px,10vw,148px) !important;
          line-height:.84 !important; letter-spacing:-.02em !important;
          text-transform:uppercase; color:var(--cream) !important;
          display:flex !important; flex-wrap:wrap;
        }
        .d-h1-accent {
          font-family:'Playfair Display',serif !important; font-style:italic !important;
          font-size:clamp(60px,8.2vw,122px) !important;
          line-height:.88 !important; letter-spacing:-.01em !important;
          color:var(--red) !important;
          display:flex !important; flex-wrap:wrap;
        }
        .d-ghost {
          font-family:'Anton',sans-serif;
          font-size:clamp(72px,10vw,148px);
          line-height:.84; letter-spacing:-.02em; text-transform:uppercase;
          -webkit-text-stroke:1.5px red; color:transparent;
          pointer-events:none; user-select:none;
        }
        .d-ghost-dark { -webkit-text-stroke:1.5px black; }
        .d-eyebrow {
          font-family:'DM Sans',sans-serif; font-size:8.5px;
          letter-spacing:.42em; text-transform:uppercase;
          color:var(--red); display:flex; align-items:center; gap:12px;
        }
        .d-eyebrow::before { content:''; width:24px; height:1px; background:var(--red); flex-shrink:0; }
        .d-sub {
          font-family:'DM Sans',sans-serif; font-size:13px;
          line-height:1.85; color:rgba(242,237,230,.46);
          font-weight:300; letter-spacing:.03em;
        }
        .d-grain {
          position:absolute; inset:0; pointer-events:none; z-index:35;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:160px; mix-blend-mode:overlay; opacity:.032;
        }
        .d-backdrop {
          position:absolute; inset:0; z-index:8; pointer-events:none;
          background:linear-gradient(100deg,rgba(3,3,3,.95) 0%,rgba(4,4,4,.84) 22%,rgba(0,0,0,.58) 44%,rgba(0,0,0,.18) 62%,transparent 76%);
        }
        .d-dot { width:4px; height:4px; background:rgba(242,237,230,.18); border-radius:2px; transition:background .35s ease,width .35s ease; cursor:pointer; }
        .d-dot.active { background:var(--red); width:22px; }

        .hero-col-left {
          position:absolute; left:0; top:0; bottom:0;
          width:clamp(420px,42vw,620px); z-index:42;
          display:flex; flex-direction:column;
          padding:0 64px; justify-content:center; gap:0;
        }
        .hero-eyebrow-row { position:absolute; top:36px; left:64px; }
        .hero-heading { display:flex; flex-direction:column; gap:4px; margin-bottom:32px; }
        .hero-body { display:flex; flex-direction:column; gap:28px; }
        .hero-bar { position:absolute; bottom:36px; left:64px; display:flex; align-items:center; gap:24px; }

        .preview-zone {
          position:absolute; right:0; top:0; bottom:0;
          width:clamp(260px,30vw,400px); z-index:44;
          display:flex; align-items:center; justify-content:center; cursor:pointer;
        }
        .preview-hint {
          font-family:'DM Sans',sans-serif; font-size:8px;
          letter-spacing:.36em; text-transform:uppercase;
          color:rgba(242,237,230,.16);
          writing-mode:vertical-rl; transform:rotate(180deg);
          pointer-events:none; transition:opacity .35s ease;
        }
        .preview-card {
          position:absolute; width:clamp(100px,14vw,300px); aspect-ratio:9/14;
          border-radius:8px; overflow:hidden;
          box-shadow:0 24px 72px rgba(0,0,0,.75),0 2px 12px rgba(0,0,0,.5);
          will-change:transform,opacity;
        }
        .preview-card video { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(.84) contrast(1.05); }
        .preview-card-inner { width:100%; height:100%; transition:transform .45s cubic-bezier(.22,1,.36,1); transform:scale(1); }
        .preview-zone:hover .preview-card-inner { transform:scale(1.04); }
        .preview-card-border {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          border:1px solid rgba(200,55,45,.18); border-radius:8px; transition:border-color .35s ease;
        }
        .preview-zone:hover .preview-card-border { border-color:rgba(200,55,45,.5); }
        .preview-card-foot {
          position:absolute; bottom:0; left:0; right:0; z-index:3;
          padding:40px 16px 16px; background:linear-gradient(transparent,rgba(0,0,0,.78));
          display:flex; justify-content:space-between; align-items:flex-end;
        }
        .preview-card-foot span { font-family:'DM Sans',sans-serif; font-size:8px; letter-spacing:.28em; text-transform:uppercase; color:rgba(242,237,230,.42); }
        .preview-tint { position:absolute; inset:0; z-index:1; pointer-events:none; background:linear-gradient(150deg,rgba(200,55,45,.1),transparent 52%); }
        .preview-badge {
          position:absolute; top:14px; left:14px; z-index:4;
          font-family:'DM Sans',sans-serif; font-size:7px; letter-spacing:.32em; text-transform:uppercase;
          color:rgba(242,237,230,.36); border:1px solid rgba(242,237,230,.12); padding:5px 9px; border-radius:2px;
        }
        video { will-change:transform; }
      `}</style>

      <div ref={heroRef} style={{ position: "relative", height: "100dvh", width: "auto", overflow: "hidden" }}>
        <div id="video-frame" style={{ position: "relative", zIndex: 10, height: "100dvh", width: "100vw", overflow: "hidden", background: "var(--black)" }}>

          {/* ── BG VIDEO ── */}
          <video ref={bgVdRef} src={VIDEO_SRC} autoPlay loop muted playsInline
            style={{ position: "absolute", inset: 0, zIndex: 1, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.65) contrast(1.1) brightness(.52)" }} />

          {/* Transition video */}
          <video ref={nextVdRef} loop muted playsInline
            style={{ position: "absolute", top: "50%", left: "50%", zIndex: 22, visibility: "hidden", width: 240, height: 240, objectFit: "cover", transform: "translate(-50%,-50%)", filter: "saturate(.82) contrast(1.06)" }} />

          <div className="d-grain" />
          <div className="d-backdrop" />
          <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none", boxShadow: "inset 0 0 120px rgba(200,55,45,.05),inset 0 0 0 1px rgba(200,55,45,.08)" }} />

          {/* Ghost inside */}
          <h1 className="d-ghost" style={{ position: "absolute", bottom: 16, right: 16, zIndex: 40 }}>21FIFTYONE</h1>

          {/* ══ LEFT COLUMN ══ */}
          <div className="hero-col-left">

            <div className="hero-eyebrow-row hero-text-item">
              <div className="d-eyebrow">{slide.eyebrow}</div>
            </div>

            <div className="hero-heading">
              <SplitText
                key={`line1-${currentIndex}`}
                text={slide.line1}
                className="d-h1"
                splitType="chars"
                delay={28}
                duration={1.0}
                ease="power3.out"
                from={{ opacity: 0, y: 60, skewX: -4 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0}
                rootMargin="0px"
                hoverRoll
                hoverRollDirection="left"
              />
              <SplitText
                key={`line2-${currentIndex}`}
                text={slide.line2}
                className="d-h1"
                splitType="chars"
                delay={28}
                duration={1.0}
                ease="power3.out"
                from={{ opacity: 0, y: 60, skewX: -4 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0}
                rootMargin="0px"
                hoverRoll
                hoverRollDirection="left"
              />
              <SplitText
                key={`accent-${currentIndex}`}
                text={slide.accent}
                className="d-h1-accent"
                splitType="words"
                delay={90}
                duration={1.1}
                ease="power4.out"
                from={{ opacity: 0, y: 72, skewX: 6 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0}
                rootMargin="0px"
                hoverRoll
                hoverRollDirection="left"
              />
            </div>

            <div className="hero-body">
              <p className="d-sub hero-text-item">{slide.sub}</p>
              <div className="hero-text-item">
                <RollButton label={slide.cta} />
              </div>
            </div>

            <div className="hero-bar hero-text-item">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`d-dot${i === currentIndex % SLIDES_COUNT ? " active" : ""}`}
                    onClick={() => { setHasClicked(true); setCurrentIndex(i); }}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(242,237,230,.2)" }}>
                {String((currentIndex % SLIDES_COUNT) + 1).padStart(2, "0")} / {String(SLIDES_COUNT).padStart(2, "0")}
              </span>
            </div>

          </div>

          {/* ══ RIGHT PREVIEW ZONE (commented out) ══ */}
          {/* <div className="preview-zone" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleMiniClick}>
            <div className="preview-hint" ref={miniHintRef}>Next slide</div>
            <div className="preview-card" ref={miniCardRef} style={miniCardInitStyle}>
              <VideoPreview>
                <div className="preview-card-inner">
                  <video ref={miniVdRef} src={VIDEO_SRC} autoPlay loop muted playsInline />
                  <div className="preview-tint" />
                  <div className="preview-badge">Next</div>
                  <div className="preview-card-border" />
                  <div className="preview-card-foot">
                    <span>Click to advance</span>
                    <span>{String(((currentIndex + 1) % SLIDES_COUNT) + 1).padStart(2, "0")} / {String(SLIDES_COUNT).padStart(2, "0")}</span>
                  </div>
                </div>
              </VideoPreview>
            </div>
          </div> */}

        </div>

        {/* Ghost outside */}
        <h1 className="d-ghost d-ghost-dark" style={{ position: "absolute", bottom: 16, right: 16 }}>21FIFTYONE</h1>
      </div>
    </>
  );
}