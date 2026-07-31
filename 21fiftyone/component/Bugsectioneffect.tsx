"use client";

/**
 * BugSectionEffect
 * ────────────────
 * • 1–2 bugs wander the section
 * • Mouse nearby → bug SLOWLY opens wings and drifts away (graceful, not instant)
 * • 3–6 small leaves randomly placed; bug seeks nearest, eats it (bite-by-bite shrink)
 * • Eaten leaf fades out, regrows at a new random spot after 3–5s
 * • Bug bobs head while eating
 */

import { useEffect, useRef, useMemo, ReactNode } from "react";

/* ══════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════ */
const FLEE_RADIUS = 120;
const FLEE_WARN   = 190;   // distance where bug slows & senses danger
const CRAWL_SPEED = 0.5;
const FLY_SPEED   = 2.4;   // slow graceful top speed
const FLY_ACCEL   = 0.055; // ramps up gradually
const BUG_SIZE    = 56;
const LEAF_SIZE   = 22;
const EAT_DIST    = 28;
const EAT_FRAMES  = 150;   // frames spent eating
const HIDE_MIN    = 3200;
const HIDE_MAX    = 6000;
const LEAF_COUNT  = 5;
const TURN_SPEED  = 0.055;

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
type BugMode = "entering" | "seeking" | "wandering" | "eating" | "fleeing" | "hidden";

interface BugState {
  x: number; y: number;
  angle: number; targetAngle: number;
  wanderTimer: number;
  mode: BugMode;
  fleeVx: number; fleeVy: number; fleeSpeed: number;
  mouseX: number; mouseY: number;
  targetLeafId: number | null;
  eatTimer: number;
}

interface LeafState {
  id: number;
  x: number; y: number; rot: number;
  scale: number;
  visible: boolean;
  growing: boolean;
  shapeIdx: number;
  colorIdx: number;
}

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function lerpAngle(a: number, b: number, t: number) {
  let d = b - a;
  while (d >  180) d -= 360;
  while (d < -180) d += 360;
  return a + d * t;
}

function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}

function edgeEntry(W: number, H: number) {
  const e = Math.floor(Math.random() * 4);
  if (e === 0) return { x: rand(20, W - 20), y: -BUG_SIZE,        angle: 180 };
  if (e === 1) return { x: W + BUG_SIZE,     y: rand(20, H - 20), angle: 270 };
  if (e === 2) return { x: rand(20, W - 20), y: H + BUG_SIZE,     angle: 0   };
               return { x: -BUG_SIZE,        y: rand(20, H - 20), angle: 90  };
}

function randLeafPos(W: number, H: number) {
  return {
    x:   60 + Math.random() * (W - 120),
    y:   50 + Math.random() * (H - 100),
    rot: Math.random() * 360,
  };
}

/* ══════════════════════════════════════════════════════
   LEAF SHAPES & COLORS
══════════════════════════════════════════════════════ */
const LEAF_PATHS = [
  "M10,0 C18,0 22,6 22,11 C22,18 18,22 10,22 C2,22 -2,18 -2,11 C-2,6 2,0 10,0 Z",
  "M10,1 C17,4 22,10 22,14 C22,20 17,23 10,23 C3,23 -2,20 -2,14 C-2,10 3,4 10,1 Z",
  "M10,22 C10,22 -1,15 -1,7 C-1,2 4,0 8,1 C9,2 10,5 10,5 C10,5 11,2 12,1 C16,0 21,2 21,7 C21,15 10,22 10,22 Z",
  "M10,0 C16,0 22,5 22,10 C22,18 16,22 10,22 C4,22 -2,18 -2,10 C-2,5 4,0 10,0 Z",
];

const LEAF_COLORS = [
  { fill: "#4a7c3f", vein: "#2e5228" },
  { fill: "#5a9e4a", vein: "#3a7030" },
  { fill: "#6ab04c", vein: "#4a8035" },
  { fill: "#3d6b35", vein: "#254520" },
  { fill: "#7bc462", vein: "#508c38" },
];

/* ══════════════════════════════════════════════════════
   LEAF SVG
══════════════════════════════════════════════════════ */
function LeafSVG({ si, ci }: { si: number; ci: number }) {
  const path  = LEAF_PATHS[si % LEAF_PATHS.length];
  const color = LEAF_COLORS[ci % LEAF_COLORS.length];
  return (
    <svg
      viewBox="-4 -2 28 28"
      width={LEAF_SIZE}
      height={LEAF_SIZE}
      style={{ display: "block", overflow: "visible" }}
    >
      <path d={path} fill={color.fill} />
      <line
        x1="10" y1="1" x2="10" y2="21"
        stroke={color.vein} strokeWidth="0.9" strokeLinecap="round" opacity="0.6"
      />
      {[0.3, 0.55, 0.75].map((t, i) => (
        <g key={i}>
          <line
            x1="10" y1={1 + t * 20} x2={10 - 6} y2={1 + t * 20 - 4}
            stroke={color.vein} strokeWidth="0.6" strokeLinecap="round" opacity="0.45"
          />
          <line
            x1="10" y1={1 + t * 20} x2={10 + 6} y2={1 + t * 20 - 4}
            stroke={color.vein} strokeWidth="0.6" strokeLinecap="round" opacity="0.45"
          />
        </g>
      ))}
      <ellipse
        cx="6" cy="6" rx="3" ry="4"
        fill="rgba(255,255,255,0.1)"
        transform="rotate(-15,6,6)"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   LEAF MANAGER HOOK
══════════════════════════════════════════════════════ */
function useLeaves(containerRef: React.RefObject<HTMLElement>, count: number) {
  const leavesRef  = useRef<LeafState[]>([]);
  const leafElsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initialise leaf state once — no Math.random() during render
  if (leavesRef.current.length === 0) {
    leavesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i, x: 0, y: 0, rot: 0,
      scale: 1, visible: false, growing: false,
      shapeIdx: Math.floor(Math.random() * LEAF_PATHS.length),
      colorIdx: Math.floor(Math.random() * LEAF_COLORS.length),
    }));
  }

  function writeLeaf(lf: LeafState) {
    const el = leafElsRef.current[lf.id];
    if (!el) return;
    if (!lf.visible) { el.style.opacity = "0"; return; }
    el.style.opacity   = String(Math.max(0, Math.min(1, lf.scale)));
    el.style.transform =
      `translate(${lf.x - LEAF_SIZE / 2}px,${lf.y - LEAF_SIZE / 2}px)`
      + ` rotate(${lf.rot}deg) scale(${Math.max(0.02, lf.scale)})`;
  }

  function eatLeaf(id: number, W: number, H: number) {
    const lf = leavesRef.current[id];
    if (!lf?.visible) return;
    const shrink = () => {
      if (lf.scale > 0.04) {
        lf.scale = Math.max(0, lf.scale - 0.012);
        writeLeaf(lf);
        setTimeout(shrink, 16);
      } else {
        lf.visible = false;
        writeLeaf(lf);
        setTimeout(() => respawn(lf, W, H), rand(3000, 5500));
      }
    };
    shrink();
  }

  function respawn(lf: LeafState, W: number, H: number) {
    const p = randLeafPos(W, H);
    lf.x = p.x; lf.y = p.y; lf.rot = p.rot;
    lf.scale   = 0.02;
    lf.visible = true;
    lf.growing = true;
    lf.shapeIdx = Math.floor(Math.random() * LEAF_PATHS.length);
    lf.colorIdx = Math.floor(Math.random() * LEAF_COLORS.length);
    writeLeaf(lf);
    const grow = () => {
      if (lf.scale < 1) {
        lf.scale = Math.min(1, lf.scale + 0.02);
        writeLeaf(lf);
        setTimeout(grow, 16);
      } else {
        lf.growing = false;
      }
    };
    grow();
  }

  // Place all leaves once container is measured
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const t = setTimeout(() => {
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      leavesRef.current.forEach((lf) => {
        const p = randLeafPos(W, H);
        lf.x = p.x; lf.y = p.y; lf.rot = p.rot;
        lf.scale   = 1;
        lf.visible = true;
        lf.growing = false;
        writeLeaf(lf);
      });
    }, 250);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { leavesRef, leafElsRef, writeLeaf, eatLeaf };
}

/* ══════════════════════════════════════════════════════
   SINGLE BUG
══════════════════════════════════════════════════════ */
interface SingleBugProps {
  containerRef: React.RefObject<HTMLElement>;
  leavesRef: React.RefObject<LeafState[]>;
  eatLeaf: (id: number, W: number, H: number) => void;
  startDelay?: number;
}

function SingleBug({ containerRef, leavesRef, eatLeaf, startDelay = 0 }: SingleBugProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const el        = elRef.current;
    if (!container || !el) return;

    const wings = el.querySelector<SVGGElement>(".bse-wings");

    const s: BugState = {
      x: 0, y: 0, angle: 90, targetAngle: 90,
      wanderTimer: 0, mode: "hidden",
      fleeVx: 0, fleeVy: 0, fleeSpeed: 0,
      mouseX: -9999, mouseY: -9999,
      targetLeafId: null, eatTimer: 0,
    };

    const setWings = (open: boolean) => {
      if (wings) wings.style.opacity = open ? "1" : "0";
    };

    const apply = () => {
      el.style.transform =
        `translate(${s.x - BUG_SIZE / 2}px,${s.y - BUG_SIZE / 2}px) rotate(${s.angle}deg)`;
    };

    const resetEntry = () => {
      const e = edgeEntry(container.offsetWidth, container.offsetHeight);
      s.x = e.x; s.y = e.y;
      s.angle = e.angle; s.targetAngle = e.angle;
      s.mode = "entering"; s.targetLeafId = null; s.fleeSpeed = 0;
      el.style.opacity = "1";
      setWings(false);
      apply();
    };

    const onMouse = (evt: MouseEvent) => {
      const r  = container.getBoundingClientRect();
      s.mouseX = evt.clientX - r.left;
      s.mouseY = evt.clientY - r.top;
    };
    const onLeave = () => { s.mouseX = -9999; s.mouseY = -9999; };
    container.addEventListener("mousemove", onMouse);
    container.addEventListener("mouseleave", onLeave);

    let raf: number;
    let eatBobT = 0;

    const frame = () => {
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      if (s.mode === "hidden") { raf = requestAnimationFrame(frame); return; }

      const mdx     = s.mouseX - s.x;
      const mdy     = s.mouseY - s.y;
      const mDist   = Math.hypot(mdx, mdy);
      const sensing = mDist < FLEE_WARN && s.mode !== "fleeing";

      /* ── Flee trigger ── */
      if (s.mode !== "fleeing" && mDist < FLEE_RADIUS) {
        s.mode       = "fleeing";
        s.fleeSpeed  = 0.3;
        const len    = mDist || 1;
        s.fleeVx     = -(mdx / len);
        s.fleeVy     = -(mdy / len);
        s.targetAngle = Math.atan2(s.fleeVy, s.fleeVx) * (180 / Math.PI) + 90;
        setWings(true);
      }

      /* ── FLEEING ── */
      if (s.mode === "fleeing") {
        s.fleeSpeed = Math.min(FLY_SPEED, s.fleeSpeed + FLY_ACCEL);
        s.x        += s.fleeVx * s.fleeSpeed;
        s.y        += s.fleeVy * s.fleeSpeed;
        s.angle     = lerpAngle(s.angle, s.targetAngle, 0.07);
        apply();
        const mg = BUG_SIZE * 3;
        if (s.x < -mg || s.x > W + mg || s.y < -mg || s.y > H + mg) {
          s.mode = "hidden";
          el.style.opacity = "0";
          setWings(false);
          setTimeout(resetEntry, rand(HIDE_MIN, HIDE_MAX));
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      /* ── EATING ── */
      if (s.mode === "eating") {
        s.eatTimer--;
        eatBobT    += 0.12;
        s.angle     = s.angle + Math.sin(eatBobT) * 0.6;
        apply();
        if (s.eatTimer <= 0) {
          if (s.targetLeafId !== null) {
            eatLeaf(s.targetLeafId, W, H);
            s.targetLeafId = null;
          }
          s.mode        = "seeking";
          s.wanderTimer = rand(30, 80);
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      /* ── ENTERING → walk toward center ── */
      if (s.mode === "entering") {
        const cx   = W / 2, cy = H / 2;
        const ex   = cx - s.x, ey = cy - s.y;
        const dist = Math.hypot(ex, ey);
        if (dist < 80) {
          s.mode = "seeking";
        } else {
          const spd = sensing ? CRAWL_SPEED * 0.35 : CRAWL_SPEED * 1.3;
          s.x      += (ex / dist) * spd;
          s.y      += (ey / dist) * spd;
          s.angle   = lerpAngle(s.angle, Math.atan2(ey, ex) * (180 / Math.PI) + 90, 0.07);
          apply();
          raf = requestAnimationFrame(frame);
          return;
        }
      }

      /* ── SEEK nearest leaf ── */
      const visLeaves = leavesRef.current?.filter((l) => l.visible && !l.growing) ?? [];

      if (visLeaves.length > 0) {
        let best  = visLeaves[0];
        let bestD = Infinity;
        for (const lf of visLeaves) {
          const d = Math.hypot(lf.x - s.x, lf.y - s.y);
          if (d < bestD) { bestD = d; best = lf; }
        }

        if (bestD < EAT_DIST && s.targetLeafId === null) {
          s.mode         = "eating";
          s.eatTimer     = EAT_FRAMES;
          s.targetLeafId = best.id;
          eatBobT        = 0;
          raf = requestAnimationFrame(frame);
          return;
        }

        const ex   = best.x - s.x, ey = best.y - s.y;
        const dist = Math.hypot(ex, ey);
        const spd  = sensing ? CRAWL_SPEED * 0.3 : CRAWL_SPEED;
        s.x        += (ex / dist) * spd;
        s.y        += (ey / dist) * spd;
        const ta   = Math.atan2(ey, ex) * (180 / Math.PI) + 90;
        s.angle    = lerpAngle(s.angle, ta, sensing ? 0.02 : TURN_SPEED);
        apply();
        raf = requestAnimationFrame(frame);
        return;
      }

      /* ── WANDER (no visible leaves) ── */
      if (--s.wanderTimer <= 0) {
        const tca  = Math.atan2(H / 2 - s.y, W / 2 - s.x) * (180 / Math.PI);
        const near = s.x < 50 || s.x > W - 50 || s.y < 50 || s.y > H - 50;
        s.targetAngle = tca + rand(near ? -55 : -155, near ? 55 : 155) - 90;
        s.wanderTimer = rand(60, 180);
      }
      const spd = sensing ? CRAWL_SPEED * 0.3 : CRAWL_SPEED;
      s.angle   = lerpAngle(s.angle, s.targetAngle, sensing ? 0.015 : TURN_SPEED);
      const rad = (s.angle - 90) * (Math.PI / 180);
      s.x      += Math.cos(rad) * spd;
      s.y      += Math.sin(rad) * spd;

      // Bounce off edges
      const p = BUG_SIZE;
      if (s.x < p)     { s.x = p;     s.targetAngle = rand(0, 180);   }
      if (s.x > W - p) { s.x = W - p; s.targetAngle = rand(180, 360); }
      if (s.y < p)     { s.y = p;     s.targetAngle = rand(90, 270);  }
      if (s.y > H - p) { s.y = H - p; s.targetAngle = rand(-90, 90);  }

      apply();
      raf = requestAnimationFrame(frame);
    };

    const timer = setTimeout(() => {
      resetEntry();
      raf = requestAnimationFrame(frame);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", onMouse);
      container.removeEventListener("mouseleave", onLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elRef}
      style={{
        position: "absolute", top: 0, left: 0,
        width: BUG_SIZE, height: BUG_SIZE,
        pointerEvents: "none",
        willChange: "transform,opacity",
        zIndex: 9999,
        transformOrigin: "center center",
        opacity: 0,
      }}
    >
      <style>{`
        @keyframes bseWingFlap {
          0%, 100% { transform: scaleX(1);    }
          50%       { transform: scaleX(1.44); }
        }
        .bse-wings {
          opacity: 0;
          transform-origin: 128px 122px;
          transition: opacity 0.4s ease;
          animation: bseWingFlap 0.3s ease-in-out infinite;
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 250"
        width={BUG_SIZE}
        height={BUG_SIZE}
        style={{ overflow: "visible", display: "block" }}
      >
        {/* Wings */}
        <g className="bse-wings">
          <ellipse cx={72}  cy={108} rx={68} ry={34}
            fill="#ffffeb" stroke="rgba(130,185,235,0.4)" strokeWidth={1.5}
            transform="rotate(-30,72,108)" />
          <ellipse cx={184} cy={108} rx={68} ry={34}
            fill="#ffffeb" stroke="rgba(130,185,235,0.4)" strokeWidth={1.5}
            transform="rotate(30,184,108)" />
        </g>
        {/* Body */}
        <g transform="translate(2,2)">
          <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52l.13,39.47c0,1.28,2.05,1.27,2.04,0l-.13-39.47c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" fill="#e41e26" fillRule="evenodd"/>
          <path d="M120.62,133.05c-3.28-1.05-6.78.75-7.84,4.03-1.05,3.27.75,6.78,4.03,7.84,3.28,1.05,6.78-.75,7.84-4.03,1.05-3.28-.75-6.78-4.03-7.84z" fill="#e41e26" fillRule="evenodd"/>
          <path d="M140.93,129.07c-1.05,3.27-4.56,5.08-7.84,4.03-3.28-1.05-5.08-4.56-4.03-7.84,1.05-3.27,4.56-5.08,7.84-4.03,3.28,1.05,5.08,4.56,4.03,7.84z" fill="#e41e26" fillRule="evenodd"/>
          <path d="M96.43,129.21c-1.08-3.27.7-6.79,3.97-7.86,3.27-1.07,6.79.71,7.86,3.97,1.08,3.27-.7,6.79-3.97,7.86-3.27,1.07-6.79-.71-7.86-3.97z" fill="#e41e26" fillRule="evenodd"/>
          <path d="M104.84,103.03c2.78-2.03,6.67-1.43,8.7,1.35,2.03,2.78,1.43,6.67-1.35,8.71-2.78,2.03-6.67,1.43-8.7-1.35-2.03-2.78-1.43-6.67,1.35-8.7z" fill="#e41e26" fillRule="evenodd"/>
          <path d="M132.35,102.94c2.79,2.01,3.42,5.9,1.41,8.69-2.02,2.79-5.91,3.42-8.7,1.41-2.79-2.02-3.42-5.91-1.41-8.7,2.01-2.79,5.91-3.42,8.69-1.41z" fill="#e41e26" fillRule="evenodd"/>
          <path d="M118.5,73.16c2.04,0,4,.42,5.8,1.2.64.28,1.38.03,1.73-.58.48-.86,1.17-1.6,2.04-2.13.92-.57,1.96-.87,3-.89.13,0,.27,0,.41,0,.46.02.87-.07,1.28-.29.28-.15.6-.24.94-.24,1.1,0,1.99.88,2,1.99s-.89,1.99-1.99,1.99c-.77,0-1.44-.43-1.77-1.07-.28-.53-.83-.81-1.42-.72-.56.09-1.09.29-1.59.59-.67.41-1.19.99-1.54,1.66,0,.01-.01.02-.02.04-.3.59-.14,1.28.37,1.69,2.94,2.31,5.03,5.65,5.63,9.34.27,1.68-1.22,2.99-2.78,2.34-3.73-1.57-7.79-2.43-12.05-2.42s-8.32.9-12.03,2.49c-1.57.67-3.06-.64-2.8-2.32.57-3.69,2.65-7.05,5.57-9.37.51-.41.66-1.11.36-1.69,0-.01-.01-.02-.02-.04-.35-.67-.88-1.24-1.55-1.65-.49-.3-1.04-.5-1.59-.58-.59-.09-1.14.19-1.41.72-.33.64-1,1.07-1.76,1.08-1.1,0-1.99-.88-1.99-1.98s.88-1.99,1.98-2c.34,0,.66.08.94.23.41.22.82.31,1.28.28.14,0,.28-.01.41,0,1.04.02,2.08.31,3.01.87.87.53,1.57,1.27,2.06,2.12.35.61,1.09.85,1.73.57,1.79-.79,3.76-1.23,5.79-1.24z" fill="#010101" fillRule="evenodd"/>
          <path d="M113.63,104.32c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85z" fill="#010101" fillRule="evenodd"/>
          <path d="M133.81,104.25c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.43-6.03,1.37-8.85z" fill="#010101" fillRule="evenodd"/>
          <path d="M140.11,123.42c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.43,6.03-1.37,8.85,2.07,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85z" fill="#010101" fillRule="evenodd"/>
          <path d="M123.82,135.24c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.06-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.06,3.43-6.03,1.37-8.85z" fill="#010101" fillRule="evenodd"/>
          <path d="M107.46,123.53c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85z" fill="#010101" fillRule="evenodd"/>
        </g>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LEAF DOM NODE
══════════════════════════════════════════════════════ */
interface LeafNodeProps {
  leaf: LeafState;
  setRef: (el: HTMLDivElement | null) => void;
}

function LeafNode({ leaf, setRef }: LeafNodeProps) {
  return (
    <div
      ref={setRef}
      style={{
        position: "absolute", top: 0, left: 0,
        width: LEAF_SIZE, height: LEAF_SIZE,
        pointerEvents: "none",
        willChange: "transform,opacity",
        zIndex: 10,
        transformOrigin: "center center",
        opacity: 0,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.22))",
      }}
    >
      <LeafSVG si={leaf.shapeIdx} ci={leaf.colorIdx} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
interface BugSectionEffectProps {
  children: ReactNode;
  /** 1 or 2 bugs. Default 1. */
  bugCount?: 1 | 2;
  /** How many leaves. Default 5. */
  leafCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function BugSectionEffect({
  children,
  bugCount  = 1,
  leafCount = LEAF_COUNT,
  className,
  style,
}: BugSectionEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Compute stable per-bug delays once — never during render
  const bugDelays = useMemo(
    () => Array.from({ length: bugCount }, (_, i) => i * 1500 + Math.random() * 800),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bugCount]
  );

  const { leavesRef, leafElsRef, eatLeaf } = useLeaves(
    containerRef as React.RefObject<HTMLElement>,
    leafCount,
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}

      {/* Leaves */}
      {leavesRef.current.map((lf) => (
        <LeafNode
          key={lf.id}
          leaf={lf}
          setRef={(el) => { leafElsRef.current[lf.id] = el; }}
        />
      ))}

      {/* Bugs */}
      {bugDelays.map((delay, i) => (
        <SingleBug
          key={i}
          containerRef={containerRef as React.RefObject<HTMLElement>}
          leavesRef={leavesRef}
          eatLeaf={eatLeaf}
          startDelay={delay}
        />
      ))}
    </div>
  );
}