"use client";

import { useEffect, useRef } from "react";

/* ── Image data — 6 images scattered around the sticky text ── */
const IMAGES = [
  {
    id: "i1",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85",
    alt: "Luxury bottle",
    // initial: small, top-left area
    ix: 3, iy: 5, iw: 18,
    // final: larger, same region
    fx: 1, fy: 2, fw: 28,
  },
  {
    id: "i2",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=85",
    alt: "Fashion",
    ix: 68, iy: 55, iw: 14,
    fx: 65, fy: 48, fw: 22,
  },
  {
    id: "i3",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=85",
    alt: "Portrait",
    ix: 72, iy: 4, iw: 20,
    fx: 70, fy: 1, fw: 30,
  },
  {
    id: "i4",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=85",
    alt: "Editorial",
    ix: 5, iy: 58, iw: 16,
    fx: 2, fy: 52, fw: 26,
  },
  {
    id: "i5",
    src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=85",
    alt: "Product",
    ix: 40, iy: 65, iw: 12,
    fx: 38, fy: 60, fw: 18,
  },
  {
    id: "i6",
    src: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&q=85",
    alt: "Luxury product",
    ix: 78, iy: 28, iw: 10,
    fx: 75, fy: 24, fw: 16,
  },
] as const;

export default function ZoomScrollSection() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef     = useRef<number>(0);
  const lastProgRef = useRef(-1);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect     = wrap.getBoundingClientRect();
      const scrolled = -rect.top;
      const total    = rect.height - window.innerHeight;
      const raw      = Math.max(0, Math.min(1, scrolled / total));

      // Ease the progress
      const p = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      if (Math.abs(p - lastProgRef.current) < 0.0005) return;
      lastProgRef.current = p;

      IMAGES.forEach((img, i) => {
        const el = imgRefs.current[i];
        if (!el) return;

        const left   = img.ix + (img.fx - img.ix) * p;
        const top    = img.iy + (img.fy - img.iy) * p;
        const width  = img.iw + (img.fw - img.iw) * p;

        // Stagger: each image starts zooming at slightly different scroll positions
        const stagger = i * 0.06;
        const sp = Math.max(0, Math.min(1, (raw - stagger) / (1 - stagger)));
        const ease = sp < 0.5 ? 2 * sp * sp : 1 - Math.pow(-2 * sp + 2, 2) / 2;

        const l = img.ix + (img.fx - img.ix) * ease;
        const t = img.iy + (img.fy - img.iy) * ease;
        const w = img.iw + (img.fw - img.iw) * ease;

        el.style.left  = `${l}%`;
        el.style.top   = `${t}%`;
        el.style.width = `${w}vw`;
        el.style.opacity = String(0.4 + ease * 0.6);
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // init
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400&display=swap');

        .zs-wrap {
          position: relative;
          height: 400vh;
          width: 100%;
        }

        .zs-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #f5f3ef;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Floating images ── */
        .zs-img {
          position: absolute;
          overflow: hidden;
          will-change: left, top, width, opacity;
          /* aspect ratio held by padding trick on inner */
          line-height: 0;
        }
        .zs-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          user-select: none;
        }
        /* Each image has its own aspect ratio via padding-bottom */
        .zs-img-inner {
          position: relative;
          width: 100%;
          padding-bottom: 130%;
          overflow: hidden;
        }
        .zs-img-inner img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Centre text ── */
        .zs-text {
          position: relative;
          z-index: 10;
          text-align: center;
          pointer-events: none;
          user-select: none;
          padding: 0 24px;
          max-width: 700px;
        }

        .zs-eyebrow {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 28px;
        }

        .zs-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(36px, 6vw, 84px);
          line-height: 1.0;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0d0d0d;
          margin: 0 0 20px;
        }

        .zs-title em {
          font-style: normal;
          color: #c8302a;
        }

        .zs-rule {
          width: 32px;
          height: 1px;
          background: #0d0d0d;
          margin: 0 auto 20px;
        }

        .zs-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 3.5vw, 46px);
          line-height: 1.15;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #0d0d0d;
        }

        /* ── Progress indicator ── */
        .zs-progress {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          pointer-events: none;
        }
        .zs-progress span {
          font-family: 'Barlow', sans-serif;
          font-size: 8px;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #666;
        }
        .zs-progress-track {
          width: 1px;
          height: 44px;
          background: #ccc;
          position: relative;
          overflow: hidden;
        }
        .zs-progress-fill {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          background: #0d0d0d;
          transition: height 0.1s linear;
        }
      `}</style>

      <div className="zs-wrap" ref={wrapRef}>
        <div className="zs-sticky">

          {/* Floating images */}
          {IMAGES.map((img, i) => (
            <div
              key={img.id}
              className="zs-img"
              ref={el => { imgRefs.current[i] = el; }}
              style={{
                left:    `${img.ix}%`,
                top:     `${img.iy}%`,
                width:   `${img.iw}vw`,
                opacity: 0.4,
              }}
            >
              <div className="zs-img-inner">
                <img src={img.src} alt={img.alt} loading="lazy" draggable={false} />
              </div>
            </div>
          ))}

          {/* Centre text — sticky, never moves */}
          <div className="zs-text">
            <span className="zs-eyebrow">Detroit Production House · Paris</span>
            <h2 className="zs-title">
              Mass Production With<br />
              <em>Artisanal-Level</em> Quality.
            </h2>
            <div className="zs-rule" />
            <p className="zs-sub">
              Studio Creativity.<br />
              Atelier Precision.<br />
              Powered by AI, CGI,<br />
              FX &amp; 3D.
            </p>
          </div>

          {/* Scroll progress line */}
          <ProgressLine wrapRef={wrapRef} />

        </div>
      </div>
    </>
  );
}

/* ── Tiny progress indicator ── */
function ProgressLine({ wrapRef }: { wrapRef: React.RefObject<HTMLDivElement | null> }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      const fill = fillRef.current;
      if (!wrap || !fill) return;
      const rect  = wrap.getBoundingClientRect();
      const p     = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      fill.style.height = `${p * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="zs-progress">
      <span>Scroll</span>
      <div className="zs-progress-track">
        <div className="zs-progress-fill" ref={fillRef} style={{ height: "0%" }} />
      </div>
    </div>
  );
}