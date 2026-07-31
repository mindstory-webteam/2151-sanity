"use client";

/**
 * BugGarden
 * ─────────
 * • 4 ladybugs glide smoothly — no shaking, no leg animation
 * • Bugs enter from left / right, seek the nearest leaf and eat it
 * • Eaten leaf shrinks → respawns at a random spot after 2s
 * • Click & drag any bug OR any leaf freely around the section
 * • Bugs loop back from the opposite side after crossing
 */

import { useEffect, useRef, useCallback } from "react";

const BUG_SIZE  = 52;
const LEAF_SIZE = 60;
const EAT_DIST  = 34;
const SPEED     = 0.6; // px / frame

const LEAF_SHAPES = [
  "M28,3 C42,3 53,13 53,28 C53,43 42,53 28,53 C14,53 3,43 3,28 C3,13 14,3 28,3 Z",
  "M28,2 C41,9 54,20 54,30 C54,44 42,54 28,54 C14,54 2,44 2,30 C2,20 15,9 28,2 Z",
  "M4,28 C4,13 13,3 28,3 C43,3 52,13 52,28 C52,43 43,53 28,53 C13,53 4,43 4,28 Z",
  "M28,50 C28,50 3,36 3,19 C3,9 11,3 20,5 C24,6 27,11 28,14 C29,11 32,6 36,5 C45,3 53,9 53,19 C53,36 28,50 28,50 Z",
  "M28,2 C37,8 47,18 47,30 C47,44 39,54 28,56 C17,54 9,44 9,30 C9,18 19,8 28,2 Z",
];

const LEAF_COLORS = [
  { fill: "#4a7c3f", vein: "#3a6030" },
  { fill: "#5a9e4a", vein: "#47842e" },
  { fill: "#6ab04c", vein: "#508c38" },
  { fill: "#3d6b35", vein: "#2e5228" },
  { fill: "#7bc462", vein: "#5ca048" },
  { fill: "#558b44", vein: "#3f6e30" },
];

interface Leaf {
  id: number;
  x: number; y: number; rot: number;
  shape: number; color: number;
  scale: number; visible: boolean;
}

interface Bug {
  id: number;
  x: number; y: number;
  angle: number;
  dir: 1 | -1;
  dragging: boolean;
  eating: boolean;
  eatTimer: number;
  targetLeafId: number | null;
}

function rndLeafPos(W: number, H: number) {
  return {
    x: 70 + Math.random() * (W - 180),
    y: 50 + Math.random() * (H - 130),
    rot: Math.random() * 360,
  };
}

function lerpAngle(a: number, b: number, t: number) {
  let d = b - a;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return a + d * t;
}

export default function BugGarden() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const bugsRef  = useRef<Bug[]>([]);
  const leafsRef = useRef<Leaf[]>([]);
  const rafRef   = useRef<number>(0);
  const dragRef  = useRef<{ kind: "bug" | "leaf"; id: number; ox: number; oy: number } | null>(null);

  const bugEls  = useRef<(HTMLDivElement | null)[]>([]);
  const leafEls = useRef<(HTMLDivElement | null)[]>([]);

  // ── DOM writers ──────────────────────────────────────
  const writeBug = useCallback((b: Bug) => {
    const el = bugEls.current[b.id];
    if (!el) return;
    el.style.transform = `translate(${b.x - BUG_SIZE / 2}px,${b.y - BUG_SIZE / 2}px) rotate(${b.angle}deg)`;
  }, []);

  const writeLeaf = useCallback((lf: Leaf) => {
    const el = leafEls.current[lf.id];
    if (!el) return;
    if (!lf.visible) { el.style.opacity = "0"; el.style.pointerEvents = "none"; return; }
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
    el.style.transform = `translate(${lf.x - LEAF_SIZE / 2}px,${lf.y - LEAF_SIZE / 2}px) rotate(${lf.rot}deg) scale(${lf.scale})`;
  }, []);

  // ── Init ─────────────────────────────────────────────
  useEffect(() => {
    const w = wrapRef.current;
    if (!w) return;
    const W = w.offsetWidth, H = w.offsetHeight;

    bugsRef.current = [
      { id: 0, x: -BUG_SIZE,    y: H * 0.24, angle: 90,  dir:  1, dragging: false, eating: false, eatTimer: 0, targetLeafId: null },
      { id: 1, x: W + BUG_SIZE, y: H * 0.58, angle: 270, dir: -1, dragging: false, eating: false, eatTimer: 0, targetLeafId: null },
      { id: 2, x: -BUG_SIZE,    y: H * 0.78, angle: 90,  dir:  1, dragging: false, eating: false, eatTimer: 0, targetLeafId: null },
      { id: 3, x: W + BUG_SIZE, y: H * 0.42, angle: 270, dir: -1, dragging: false, eating: false, eatTimer: 0, targetLeafId: null },
    ];
    leafsRef.current = Array.from({ length: 6 }, (_, i) => {
      const p = rndLeafPos(W, H);
      return { id: i, x: p.x, y: p.y, rot: p.rot, shape: i % 5, color: i % 6, scale: 1, visible: true };
    });

    bugsRef.current.forEach(writeBug);
    leafsRef.current.forEach(writeLeaf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── RAF loop ─────────────────────────────────────────
  useEffect(() => {
    const frame = () => {
      const w = wrapRef.current;
      if (!w) { rafRef.current = requestAnimationFrame(frame); return; }
      const W = w.offsetWidth, H = w.offsetHeight;
      const visible = leafsRef.current.filter((l) => l.visible);

      bugsRef.current.forEach((bug) => {
        if (bug.dragging) return;

        // Eating pause
        if (bug.eating) {
          bug.eatTimer--;
          if (bug.eatTimer <= 0) {
            bug.eating = false;
            const lid = bug.targetLeafId;
            bug.targetLeafId = null;
            if (lid !== null) {
              const lf = leafsRef.current[lid];
              if (lf) {
                lf.visible = false;
                writeLeaf(lf);
                // Respawn after 2s
                setTimeout(() => {
                  const p = rndLeafPos(W, H);
                  lf.x = p.x; lf.y = p.y; lf.rot = p.rot; lf.scale = 0; lf.visible = true;
                  writeLeaf(lf);
                  const grow = () => {
                    if (lf.scale < 1) { lf.scale = Math.min(1, lf.scale + 0.05); writeLeaf(lf); setTimeout(grow, 16); }
                  };
                  grow();
                }, 2000);
              }
            }
          }
          return;
        }

        // Pick nearest leaf
        let tx = bug.x + bug.dir * 8;
        let ty = bug.y;
        if (visible.length > 0) {
          let best = visible[0], bestD = Infinity;
          for (const lf of visible) {
            const d = Math.hypot(lf.x - bug.x, lf.y - bug.y);
            if (d < bestD) { bestD = d; best = lf; }
          }
          tx = best.x; ty = best.y;

          if (bestD < EAT_DIST) {
            bug.eating = true; bug.eatTimer = 85; bug.targetLeafId = best.id;
            const lf = best;
            const shrink = () => {
              if (lf.scale > 0.02) { lf.scale = Math.max(0, lf.scale - 0.016); writeLeaf(lf); setTimeout(shrink, 16); }
            };
            shrink();
            return;
          }
        }

        // Smooth move — no wobble
        const dx = tx - bug.x, dy = ty - bug.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) {
          bug.x += (dx / dist) * SPEED;
          bug.y += (dy / dist) * SPEED;
          const tAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          bug.angle = lerpAngle(bug.angle, tAngle, 0.045);
        }

        // Loop
        if (bug.x > W + BUG_SIZE * 2)  { bug.x = -BUG_SIZE;    bug.y = 40 + Math.random() * (H - 100); bug.dir =  1; }
        if (bug.x < -BUG_SIZE * 2)     { bug.x = W + BUG_SIZE;  bug.y = 40 + Math.random() * (H - 100); bug.dir = -1; }

        writeBug(bug);
      });

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [writeBug, writeLeaf]);

  // ── Pointer drag ─────────────────────────────────────
  const onBugDown  = (id: number) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = bugsRef.current[id];
    if (!b) return;
    b.dragging = true;
    dragRef.current = { kind: "bug", id, ox: e.clientX - b.x, oy: e.clientY - b.y };
  };
  const onLeafDown = (id: number) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const lf = leafsRef.current[id];
    if (!lf || !lf.visible) return;
    dragRef.current = { kind: "leaf", id, ox: e.clientX - lf.x, oy: e.clientY - lf.y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { kind, id, ox, oy } = dragRef.current;
    if (kind === "bug") {
      const b = bugsRef.current[id]; if (!b) return;
      b.x = e.clientX - ox; b.y = e.clientY - oy;
      writeBug(b);
    } else {
      const lf = leafsRef.current[id]; if (!lf) return;
      lf.x = e.clientX - ox; lf.y = e.clientY - oy;
      writeLeaf(lf);
    }
  };
  const onUp = () => {
    if (dragRef.current?.kind === "bug") bugsRef.current[dragRef.current.id].dragging = false;
    dragRef.current = null;
  };

  // ── Render ───────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@600&display=swap');

        .bgd-wrap {
          position: relative;
          width: 100%;
          min-height: 480px;
          background: #ffff;
          overflow: hidden;
        }
        .bgd-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 90% 50% at 50% 100%, rgba(18,48,8,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 8% 88%,  rgba(12,38,6,0.14) 0%, transparent 60%);
          pointer-events: none;
        }

        .bgd-bug {
          position: absolute; top: 0; left: 0;
          width: ${BUG_SIZE}px; height: ${BUG_SIZE}px;
          cursor: grab; z-index: 20; will-change: transform;
          transform-origin: center center;
        }
        .bgd-bug:active { cursor: grabbing; }

        .bgd-leaf {
          position: absolute; top: 0; left: 0;
          width: ${LEAF_SIZE}px; height: ${LEAF_SIZE}px;
          cursor: grab; z-index: 10; will-change: transform;
          transform-origin: center center;
          filter: drop-shadow(1px 3px 5px rgba(0,0,0,0.38));
          transition: opacity 0.3s ease;
        }
        .bgd-leaf:active { cursor: grabbing; }

        .bgd-hint {
          position: absolute; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.32em; color: rgba(255,255,255,0.16);
          text-transform: uppercase; pointer-events: none; white-space: nowrap;
        }
      `}</style>

      <div
        ref={wrapRef}
        className="bgd-wrap"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        aria-label="Interactive bug garden"
      >
        {/* ── Bugs ── */}
        {[0, 1, 2, 3].map((id) => (
          <div key={`b${id}`} className="bgd-bug" ref={(el) => { bugEls.current[id] = el; }} onPointerDown={onBugDown(id)}>
            <svg viewBox="0 0 799.92 799.92" style={{ width: "100%", height: "100%", display: "block" }}>
              <ellipse cx="400" cy="758" rx="165" ry="22" fill="rgba(0,0,0,0.14)" />
              <path d="M507.22,550.26c-4.76-5.34-13.3,2.27-8.54,7.61" fill="#e31e26" fillRule="evenodd" />
              <path d="M453.94,482.81c-17.65,7.73-25.66,28.3-17.93,45.94,7.73,17.62,28.3,25.64,45.93,17.92,17.63-7.75,25.66-28.3,17.93-45.94-7.75-17.63-28.31-25.65-45.93-17.92Z" fill="#e31e26" fillRule="evenodd" />
              <path d="M338.31,556.42c-16.63-9.72-22.22-31.07-12.51-47.7,9.72-16.61,31.08-22.21,47.69-12.49,16.63,9.72,22.22,31.07,12.51,47.7-9.72,16.61-31.08,22.21-47.69,12.49Z" fill="#e31e26" fillRule="evenodd" />
              <path d="M516.63,597.03c-74.43,53.27-181.4,39.96-246.97-33.67-65.57-73.63-66.43-181.42-4.92-249.2,2.27-2.49,5.16-3.75,8.52-3.74,3.36.01,6.25,1.33,8.48,3.83l146.91,164.98c4.75,5.33,13.29-2.28,8.54-7.61l-146.91-164.98c-2.23-2.5-3.2-5.53-2.82-8.87.38-3.34,1.98-6.07,4.7-8.03,74.43-53.27,181.4-39.96,246.97,33.67,65.57,73.63,66.43,181.42,4.92,249.2" fill="#e31e26" fillRule="evenodd" />
              <path d="M524.3,390.79c7.73,17.62-.28,38.18-17.92,45.93-17.64,7.73-38.19-.3-45.94-17.93-7.72-17.63.3-38.19,17.92-45.93,17.64-7.73,38.21.29,45.94,17.93Z" fill="#e31e26" fillRule="evenodd" />
              <path d="M276.47,415.45c4.1-18.82,22.68-30.74,41.49-26.62,18.82,4.1,30.74,22.68,26.64,41.5-4.11,18.81-22.69,30.72-41.5,26.61-18.82-4.1-30.74-22.68-26.62-41.49Z" fill="#e31e26" fillRule="evenodd" />
              <path d="M391.42,313.09c19.16-1.91,36.24,12.07,38.15,31.22,1.9,19.17-12.08,36.25-31.24,38.16-19.17,1.9-36.23-12.09-38.15-31.25-1.91-19.16,12.08-36.25,31.24-38.13Z" fill="#e31e26" fillRule="evenodd" />
              <path d="M222.96,239.64c8.52-7.58,18.36-13.07,28.78-16.49,3.72-1.22,5.91-5.01,5.07-8.85-1.16-5.37-1-11.05.66-16.52,1.73-5.8,4.98-10.89,9.28-14.86.55-.52,1.14-1.02,1.74-1.5,2.02-1.63,3.38-3.5,4.28-5.95.62-1.66,1.63-3.2,3.05-4.46,4.59-4.09,11.64-3.69,15.74.91,4.09,4.59,3.66,11.64-.92,15.72-3.21,2.86-7.62,3.53-11.36,2.09-3.12-1.18-6.48-.28-8.61,2.28-1.99,2.44-3.52,5.25-4.46,8.38-1.26,4.2-1.32,8.59-.31,12.69.02.08.03.14.05.22.93,3.56,4.15,5.91,7.84,5.7,20.86-1.21,42.03,5.01,58.21,18.26,7.35,6.01,6.01,17.06-3,20.11-21.45,7.23-41.68,18.72-59.47,34.56-17.79,15.84-31.54,34.61-41.18,55.07-4.08,8.61-15.21,8.67-20.34.67-11.29-17.6-15.04-39.34-11.41-59.94.63-3.64-1.33-7.11-4.77-8.43-.08-.03-.14-.05-.22-.08-3.95-1.48-8.32-1.93-12.64-1.16-3.2.56-6.19,1.77-8.84,3.46-2.79,1.82-4.07,5.05-3.24,8.28.99,3.9-.19,8.2-3.4,11.06-4.59,4.09-11.63,3.68-15.71-.91-4.1-4.6-3.69-11.64.9-15.72,1.41-1.26,3.07-2.09,4.78-2.51,2.54-.61,4.56-1.74,6.41-3.56.55-.54,1.12-1.07,1.71-1.57,4.43-3.8,9.86-6.44,15.83-7.5,5.61-1,11.27-.51,16.49,1.25,3.72,1.27,7.73-.45,9.38-4.02,4.59-9.95,11.18-19.09,19.69-26.67Z" fillRule="evenodd" />
              <path d="M318.1,388.27c-19.13-4.17-38.02,7.95-42.19,27.05-4.17,19.13,7.95,38.02,27.06,42.2,19.12,4.16,38.01-7.96,42.18-27.07,4.17-19.13-7.93-38.01-27.05-42.19Z" fillRule="evenodd" />
              <path d="M402.44,313.16c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.08,42.19,19.11,4.17,37.99-7.95,42.18-27.07,4.17-19.13-7.95-37.99-27.07-42.18Z" fillRule="evenodd" />
              <path d="M499.94,370.18c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.96,38.01,27.07,42.18,19.13,4.17,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18Z" fillRule="evenodd" />
              <path d="M475.5,480.11c-19.13-4.17-38.01,7.93-42.18,27.07-4.18,19.12,7.93,38.01,27.05,42.19,19.13,4.17,38.01-7.96,42.19-27.08,4.17-19.11-7.95-37.99-27.07-42.18Z" fillRule="evenodd" />
              <path d="M363.46,491.71c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.07,42.18,19.12,4.18,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18Z" fillRule="evenodd" />
            </svg>
          </div>
        ))}

        {/* ── Leaves ── */}
        {[0, 1, 2, 3, 4, 5].map((id) => {
          const shape = LEAF_SHAPES[id % 5];
          const color = LEAF_COLORS[id % 6];
          return (
            <div key={`l${id}`} className="bgd-leaf" ref={(el) => { leafEls.current[id] = el; }} onPointerDown={onLeafDown(id)}>
              <svg viewBox="0 0 56 56" width={LEAF_SIZE} height={LEAF_SIZE}>
                <path d={shape} fill={color.fill} />
                <line x1="28" y1="5" x2="28" y2="51" stroke={color.vein} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
                {[0.28, 0.46, 0.62, 0.76].map((t, i) => (
                  <g key={i}>
                    <line x1="28" y1={5 + t * 46} x2={28 - 11} y2={5 + t * 46 - 7} stroke={color.vein} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                    <line x1="28" y1={5 + t * 46} x2={28 + 11} y2={5 + t * 46 - 7} stroke={color.vein} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                  </g>
                ))}
                <ellipse cx="21" cy="17" rx="5" ry="7" fill="rgba(255,255,255,0.1)" transform="rotate(-20,21,17)" />
              </svg>
            </div>
          );
        })}

        <span className="bgd-hint">Drag leaves & bugs · Bugs will seek and eat leaves</span>
      </div>
    </>
  );
}