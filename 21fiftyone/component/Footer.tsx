"use client";

import { useState } from "react";
import Link from "next/link";

const B = {
  red:   "#c8372d",
  cream: "#f2ede6",
  black: "#0c0c0c",
  muted: "#8a8480",
  line:  "rgba(12,12,12,0.10)",
};

const LOGO_SRC = "/logo/2151-logo.png";

// ── Place wordmark-halfcut.png inside /public/images/ ──
const WORDMARK_SRC = "/logo/2151-logo.png";

// ── Address shown at the top of the brand column, clickable → opens Google Maps ──
const ADDRESS_TEXT = "Regus Door No. 2703, Cabin 721, HiLITE Business Park, 7th Floor, Tower 2, Pantheeramkavu, Kozhikode, Kerala 673014";
const ADDRESS_MAPS_URL = "https://maps.google.com/?q=Thrissur+Kozhikode+Kerala+India";

const NAV_COLS = [
  
  {
    heading: "Studio",
    links: [
      { label: "About",   href: "/about"  },
      { label: "Studio",  href: "/studio" },
      { label: "Careers", href: "/careers"       },
      { label: "Contact", href: "/contact"       },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "VISUAL PRODUCTION", href: "/services" },
      { label: "MOVIE PRODUCTION",   href: "/services" },
      { label: "CORPORATE FILMS", href: "/services" },
      { label: "COMMERCIAL PRODUCTION", href: "/services" },
      { label: "AI PRODUCTION", href: "/services" },
       { label: "ENTERTAINMENT EVENTS", href: "/services" },
    ],
  },
  {
    heading: "Policies",
    links: [
     { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/21fiftyone?igsh=MXV2NTI3M2QzMTMwZw==",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
  label: "Facebook",
  href: "https://www.facebook.com/share/1Aw4MkQKzk/?mibextid=wwXIfr",
  icon: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.88h-2.4v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
},
  {
    label: "Behance",
    href: "https://www.behance.net/mindstorycreative",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 11.5c.83 0 1.5-.67 1.5-1.5S8.33 8.5 7.5 8.5H4v3h3.5zm.25 2H4v3.5h3.75c.97 0 1.75-.78 1.75-1.75S8.72 13.5 7.75 13.5zM2 7h6.5c1.93 0 3.5 1.34 3.5 3 0 1.01-.51 1.91-1.29 2.46C11.87 13.05 12.5 14.2 12.5 15.5c0 2.07-1.68 3.75-3.75 3.75H2V7zm14.5 2.5c-1.38 0-2.5.78-2.86 1.9h5.72c-.36-1.12-1.48-1.9-2.86-1.9zM22 14h-7.5c.23 1.28 1.37 2.25 2.75 2.25.87 0 1.64-.41 2.13-1.05l1.93.93C20.53 17.38 19.1 18 17.5 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5v1zm-6.5-5H21v-1.5h-5.5V9z"/>
      </svg>
    ),
  },
];

/* ─── internal SplitText (no external dep needed) ─── */
interface SplitTextProps {
  text:           string;
  color?:         string;
  hoverColor?:    string;
  fontSize?:      string | number;
  fontFamily?:    string;
  fontWeight?:    number;
  letterSpacing?: string;
  textTransform?: React.CSSProperties["textTransform"];
  lineHeight?:    string | number;
  direction?:     "left" | "center" | "right";
  staggerMs?:     number;
  durationMs?:    number;
}

function SplitText({
  text,
  color          = "inherit",
  hoverColor,
  fontSize       = "inherit",
  fontFamily     = "inherit",
  fontWeight     = 500,
  letterSpacing  = "inherit",
  textTransform  = "uppercase",
  lineHeight     = 1,
  direction      = "left",
  staggerMs      = 28,
  durationMs     = 400,
}: SplitTextProps) {
  const chars  = text.split("");
  const total  = chars.length;
  const easing = "cubic-bezier(.16,1,.3,1)";

  function delay(i: number) {
    if (direction === "left")  return i * staggerMs;
    if (direction === "right") return (total - 1 - i) * staggerMs;
    const mid = (total - 1) / 2;
    return Math.abs(i - mid) * staggerMs;
  }

  return (
    <span
      aria-label={text}
      style={{ display: "inline-flex", flexWrap: "nowrap", fontSize, fontFamily, fontWeight, letterSpacing, textTransform, lineHeight, color }}
    >
      {chars.map((ch, i) => (
        <span key={i} style={{ display: "inline-block", position: "relative", overflow: "hidden", lineHeight }}>
          <span className="ft-char-real" style={{ display: "block", transition: `transform ${durationMs}ms ${easing} ${delay(i)}ms` }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
          <span aria-hidden className="ft-char-ghost" style={{ display: "block", position: "absolute", top: "100%", left: 0, whiteSpace: "pre", transition: `transform ${durationMs}ms ${easing} ${delay(i)}ms`, color: hoverColor ?? color }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

function FooterNavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "inline-block" }}>
      <SplitText text={label} color="rgba(12,12,12,0.42)" hoverColor={B.red} fontSize={10.5} fontFamily="'Montserrat', sans-serif" fontWeight={500} letterSpacing="0.12em" direction="left" staggerMs={18} durationMs={320} />
    </Link>
  );
}

// ── CHANGED: icons-only inline social icon button (no label, no column layout)
function SocialIconLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: `1px solid ${hov ? B.red : "rgba(12,12,12,0.14)"}`,
        color: hov ? B.red : B.muted,
        flexShrink: 0,
        transition: "border-color 0.25s ease, color 0.25s ease, background 0.25s ease",
        background: hov ? "rgba(200,55,45,0.06)" : "transparent",
      }}
    >
      {icon}
    </Link>
  );
}

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ft-footer {
          width: 100%;
          background: ${B.cream};
          border-top: 1px solid ${B.line};
          font-family: 'Montserrat', sans-serif;
          position: relative;
          overflow: hidden;
        }

        a:hover .ft-char-real  { transform: translateY(-100%); }
        a:hover .ft-char-ghost { transform: translateY(-100%); }

        /* ── TOP GRID ── */
        .ft-top {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 64px 64px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
          border-bottom: 1px solid ${B.line};
        }

        .ft-brand-logo { display: block; margin-bottom: 20px; text-decoration: none; }
        .ft-brand-logo img { height: 32px; width: auto; display: block; object-fit: contain; }
        .ft-brand-tagline { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; line-height: 1.75; color: ${B.muted}; margin: 0 0 20px; max-width: 220px; }

        /* ── ADDRESS (top of brand column, above email) ── */
        .ft-brand-address {
          display: inline-flex;
          align-items: flex-start;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.02em;
          color: ${B.muted};
          text-decoration: none;
          margin-bottom: 16px;
          max-width: 220px;
          transition: color 0.2s ease;
        }
        .ft-brand-address:hover { color: ${B.red}; }
        .ft-brand-address svg { flex-shrink: 0; margin-top: 1px; }

        .ft-brand-email { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: ${B.red}; transition: opacity 0.2s ease; margin-bottom: 32px; }
        .ft-brand-email:hover { opacity: 0.7; }

        .ft-socials-label { font-size: 9px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: ${B.muted}; margin-bottom: 14px; display: block; }

        /* ── CHANGED: inline row of icon-only buttons ── */
        .ft-socials-row { display: flex; flex-direction: row; gap: 10px; align-items: center; }

        .ft-nav-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .ft-col-heading { font-size: 9px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: ${B.black}; margin: 0 0 24px; display: flex; align-items: center; gap: 10px; }
        .ft-col-heading::after { content: ''; flex: 1; height: 1px; background: ${B.red}; opacity: 0.25; }
        .ft-col-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }

        /* ── WORDMARK HALF-CUT IMAGE ── */
        .ft-wordmark-section {
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        .ft-wordmark-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 15vw;
          object-fit: cover;
          object-position: top left;
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 64px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid ${B.line};
        }
        .ft-copyright { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: ${B.muted}; }
        .ft-status { display: inline-flex; align-items: center; gap: 7px; font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: ${B.muted}; }
        .ft-status-dot { width: 5px; height: 5px; border-radius: 50%; background: ${B.red}; animation: ft-pulse 2.4s ease-in-out infinite; flex-shrink: 0; }
        @keyframes ft-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(200,55,45,0.55); }
          50%      { opacity:.7; box-shadow:0 0 0 5px rgba(200,55,45,0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .ft-top { grid-template-columns: 1fr; gap: 52px; padding: 60px 40px 48px; }
          .ft-bottom { padding: 18px 40px 28px; }
          .ft-wordmark-img { max-height: 22vw; }
        }
        @media (max-width: 640px) {
          .ft-top { padding: 48px 28px 40px; }
          .ft-nav-cols { grid-template-columns: 1fr 1fr; gap: 36px; }
          .ft-bottom { padding: 18px 28px 24px; flex-direction: column; align-items: flex-start; }
          .ft-wordmark-img { max-height: 28vw; }
        }
        @media (max-width: 420px) {
          .ft-nav-cols { grid-template-columns: 1fr; }
          .ft-wordmark-img { max-height: 36vw; }
        }

        .ft-brand-email { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: ${B.red}; transition: opacity 0.2s ease; margin-bottom: 6px; }
.ft-brand-email:hover { opacity: 0.7; }
.ft-brand-phone { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; color: ${B.red}; transition: opacity 0.2s ease; margin-bottom: 32px; }
.ft-brand-phone:hover { opacity: 0.7; }
      `}</style>

      <footer className="ft-footer">

        {/* ── TOP GRID ── */}
        <div className="ft-top">
          <div>
            <Link href="/" className="ft-brand-logo">
              <img src={LOGO_SRC} alt="21FiftyOne" />
            </Link>
            <p className="ft-brand-tagline">
              Elevating brands through the art of digital alchemy and technical precision.
            </p>

            {/* ── ADDRESS: clickable, opens Google Maps in a new tab ── */}
            <Link
              href={ADDRESS_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-brand-address"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{ADDRESS_TEXT}</span>
            </Link>

            <Link href="mailto:hello@21fiftyone.com" className="ft-brand-email">
              hello@21fiftyone.com
            </Link>
            <br/>
            <Link href="tel:+917736402151" className="ft-brand-phone">
  +91 77364 02151
</Link>
            <span className="ft-socials-label">Follow Us</span>
            {/* ── CHANGED: icon-only inline row ── */}
            <div className="ft-socials-row">
              {SOCIAL_LINKS.map((s) => (
                <SocialIconLink key={s.label} href={s.href} label={s.label} icon={s.icon} />
              ))}
            </div>
          </div>

          <div className="ft-nav-cols">
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <p className="ft-col-heading">{col.heading}</p>
                <ul className="ft-col-links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink label={link.label} href={link.href} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHANGED: bottom bar now sits ABOVE the wordmark ── */}
        <div className="ft-bottom">
          <span className="ft-copyright">
            &copy; {new Date().getFullYear()} 21FiftyOne. All rights reserved.
          </span>
          <span className="ft-status">
            <span className="ft-status-dot" />
            Thrissur / Kozhikode, IN &mdash; Est. 2006
          </span>
        </div>

        {/* ── WORDMARK HALF-CUT IMAGE (now the very last element) ── */}
        <div className="ft-wordmark-section">
          <img
            src={WORDMARK_SRC}
            alt="21FiftyOne"
            className="ft-wordmark-img"
            draggable={false}
          />
        </div>

      </footer>
    </>
  );
}