"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "HOME",     href: "/"        },
  { label: "ABOUT",    href: "/about"   },
  { label: "SERVICES", href: "/services"},
  { label: "STUDIO",   href: "/studio"  },
  { label: "CONTACT",  href: "/contact" },
   { label: "CAREERS",  href: "/careers" },
    { label: "BLOGS",  href: "/blog" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/21fiftyone?igsh=MXV2NTI3M2QzMTMwZw==" },
  { label: "Facebook",  href: "https://www.facebook.com/share/1Aw4MkQKzk/?mibextid=wwXIfr"    },
  { label: "Behance",   href: "https://www.behance.net/mindstorycreative"                       },
];

const B = {
  red:      "#c8372d",
  redDeep:  "#9e2118",
  cream:    "#f2ede6",
  creamDim: "rgba(242,237,230,0.42)",
  panel:    "#0f0e0e",
  layer1:   "#1c1010",
  layer2:   "#c8372d",
};

const LOGO_SRC = "/logo/2151-logo.png";

type NavTheme = "light" | "dark" | "red" | "cream";
interface PillStyle {
  bg: string; border: string; shadow: string;
  textColor: string; iconColor: string;
}

const THEME_MAP: Record<NavTheme, PillStyle> = {
  light: { bg:"rgba(255,255,255,0.92)", border:"rgba(0,0,0,0.08)",      shadow:"0 4px 32px rgba(0,0,0,0.10)",     textColor:"#1a1a1a", iconColor:"#1a1a1a" },
  dark:  { bg:"rgba(12,12,12,0.92)",   border:"rgba(255,255,255,0.10)", shadow:"0 4px 32px rgba(0,0,0,0.40)",     textColor:"#f2ede6", iconColor:"#f2ede6" },
  red:   { bg:"rgba(200,55,45,0.95)",  border:"rgba(255,255,255,0.18)", shadow:"0 4px 32px rgba(200,55,45,0.35)", textColor:"#ffffff", iconColor:"#ffffff" },
  cream: { bg:"rgba(242,237,230,0.95)",border:"rgba(200,55,45,0.18)",   shadow:"0 4px 32px rgba(0,0,0,0.08)",     textColor:"#1a1a1a", iconColor:"#1a1a1a" },
};

function useSectionTheme(enabled: boolean): NavTheme {
  const [theme, setTheme] = useState<NavTheme>("light");
  useEffect(() => {
    if (!enabled) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]"));
    if (!sections.length) return;
    const ratios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target as HTMLElement, e.intersectionRatio));
        let best: HTMLElement | null = null;
        let bestRatio = -1;
        ratios.forEach((ratio, el) => {
          if (ratio > bestRatio) { bestRatio = ratio; best = el; }
        });
        if (best) {
          const raw = (best as HTMLElement).dataset.navTheme as NavTheme;
          setTheme(THEME_MAP[raw] ? raw : "light");
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);
  return theme;
}

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
  easing?:        string;
  style?:         React.CSSProperties;
}

/* ─────────────────────────────────────────────────────────────
   SplitText — FIXED

   The hover-reveal "ghost" character used to be rendered as a
   second real DOM text node (aria-hidden, but still literal
   text). Next.js server-renders "use client" components before
   any JS runs, so that raw duplicated text (e.g. "HHOOMMEE") was
   present in the HTML delivered to crawlers, link-unfurlers, and
   any tool that reads text nodes without respecting aria-hidden.

   Fix: the ghost character is now painted via CSS
   `content: attr(data-ghost)` on a ::after pseudo-element. This
   is drawn by the browser but is NOT a real text node — it can't
   be scraped, copied, or indexed as duplicate text. The visual
   animation is identical. See the updated .fnb-char-wrap rules
   in the <style> block below.
────────────────────────────────────────────────────────────── */
function SplitText({
  text,
  color         = "inherit",
  hoverColor,
  fontSize      = "inherit",
  fontFamily    = "inherit",
  fontWeight    = 500,
  letterSpacing = "inherit",
  textTransform = "uppercase",
  lineHeight    = 1,
  direction     = "left",
  staggerMs     = 28,
  durationMs    = 400,
  easing        = "cubic-bezier(.16,1,.3,1)",
  style,
}: SplitTextProps) {
  const chars = text.split("");
  const total = chars.length;

  function delay(i: number) {
    if (direction === "left")  return i * staggerMs;
    if (direction === "right") return (total - 1 - i) * staggerMs;
    const mid = (total - 1) / 2;
    return Math.abs(i - mid) * staggerMs;
  }

  return (
    <span
      aria-label={text}
      style={{
        display: "inline-flex", flexWrap: "nowrap",
        fontSize, fontFamily, fontWeight,
        letterSpacing, textTransform, lineHeight,
        color, ...style,
      }}
    >
      {chars.map((ch, i) => {
        const displayChar = ch === " " ? "\u00A0" : ch;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="fnb-char-wrap"
            data-ghost={displayChar}
            style={
              {
                display: "inline-block",
                position: "relative",
                overflow: "hidden",
                lineHeight,
                // consumed by .fnb-char-real / .fnb-char-wrap::after in <style> below
                "--fnb-delay": `${delay(i)}ms`,
                "--fnb-duration": `${durationMs}ms`,
                "--fnb-easing": easing,
                "--fnb-hover-color": hoverColor || color,
              } as React.CSSProperties
            }
          >
            {/* Single real text node per character */}
            <span className="fnb-char-real">{displayChar}</span>
          </span>
        );
      })}
    </span>
  );
}

interface RollButtonProps {
  label:       string;
  href?:       string;
  onClick?:    () => void;
  variant?:    "filled" | "outline" | "ghost";
  size?:       "sm" | "md";
  color?:      string;
  bg?:         string;
  hoverBg?:    string;
  hoverColor?: string;
  fullWidth?:  boolean;
  style?:      React.CSSProperties;
}

function RollButton({
  label, href, onClick,
  variant = "filled", size = "md",
  color, bg, hoverBg, hoverColor,
  fullWidth = false, style,
}: RollButtonProps) {
  const [hov, setHov] = useState(false);

  const defaults = {
    filled:  { bg: `linear-gradient(135deg,${B.red} 0%,${B.redDeep} 100%)`, color: "#fff",  hoverBg: B.redDeep,                hoverColor: "#fff" },
    outline: { bg: "transparent",                                             color: B.red,   hoverBg: B.red,                    hoverColor: "#fff" },
    ghost:   { bg: "transparent",                                             color: B.cream, hoverBg: "rgba(255,255,255,0.08)", hoverColor: "#fff" },
  }[variant];

  const rBg    = bg         ?? defaults.bg;
  const rColor = color      ?? defaults.color;
  const rHovBg = hoverBg    ?? defaults.hoverBg;
  const rHovC  = hoverColor ?? defaults.hoverColor;
  const pad    = size === "sm" ? "10px 20px" : "13px 28px";
  const fs     = size === "sm" ? 9 : 10;

  const inner = (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%",
      position: "relative", overflow: "hidden",
      padding: pad, transition: "background .35s ease",
      background: hov ? rHovBg : rBg,
      borderRadius: "inherit",
      border: variant === "outline" ? `1px solid ${B.red}` : "none",
      boxShadow: variant === "filled" ? "0 2px 12px rgba(200,55,45,0.38)" : "none",
    }}>
      <span style={{
        display: "block",
        transform: hov ? "translateY(-110%)" : "translateY(0)",
        transition: "transform .42s cubic-bezier(.16,1,.3,1)",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: fs, fontWeight: 700,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: rColor, whiteSpace: "nowrap",
        pointerEvents: "none", userSelect: "none",
      }}>{label}</span>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          position: "absolute", left: 0, right: 0, textAlign: "center",
          transform: hov ? "translateY(0)" : "translateY(110%)",
          transition: "transform .42s cubic-bezier(.16,1,.3,1)",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: fs, fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: rHovC, whiteSpace: "nowrap",
          pointerEvents: "none", userSelect: "none",
        }}
      >{label}</span>
    </span>
  );

  const shared: React.CSSProperties = {
    display: fullWidth ? "block" : "inline-block",
    width: fullWidth ? "100%" : undefined,
    textDecoration: "none", borderRadius: 10,
    cursor: "pointer", outline: "none",
    background: "none", border: "none",
    padding: 0, overflow: "hidden",
    ...style,
  };

  if (href) return (
    <Link href={href} style={shared}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{inner}</Link>
  );
  return (
    <button style={shared} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{inner}</button>
  );
}

function LogoMark({ logoSrc }: { logoSrc: string }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      <img
        src={logoSrc}
        alt="21Fiftyone logo"
        style={{
          height: 28,
          width: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    </Link>
  );
}

function NavSplitLink({ label, href, active, iconColor }: { label: string; href: string; active: boolean; iconColor: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        textDecoration: "none", padding: "8px 14px",
        borderRadius: 10, display: "block",
        background: active ? "rgba(200,55,45,.09)" : hov ? "rgba(0,0,0,.04)" : "transparent",
        border: active ? "0.5px solid rgba(200,55,45,.28)" : "0.5px solid transparent",
        transition: "background .2s ease, border-color .2s ease",
        position: "relative",
      }}
    >
      <SplitText
        text={label}
        fontSize={10.5}
        fontFamily="'Montserrat',sans-serif"
        fontWeight={active ? 700 : 500}
        letterSpacing="0.12em"
        color={active ? B.red : hov ? iconColor : `${iconColor}70`}
        hoverColor={B.red}
        direction="center"
        staggerMs={20}
        durationMs={340}
      />
      {active && (
        <span style={{
          position: "absolute", bottom: 4, left: "50%",
          transform: "translateX(-50%)",
          width: 3, height: 3, borderRadius: "50%",
          background: B.red,
        }} />
      )}
    </Link>
  );
}

interface MenuToggleProps {
  open: boolean; onClick: () => void;
  plusHRef: React.RefObject<HTMLSpanElement | null>;
  plusVRef: React.RefObject<HTMLSpanElement | null>;
  iconRef:  React.RefObject<HTMLSpanElement | null>;
  color?: string; label?: string;
}

function MenuToggle({ open, onClick, plusHRef, plusVRef, iconRef, color = "#1a1a1a", label = "MENU" }: MenuToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="fnb-panel"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        background: "transparent", border: "none",
        cursor: "pointer", outline: "none",
        padding: 0, color, transition: "color .4s ease",
      }}
    >
      <SplitText
        text={label} color={color} hoverColor={color}
        fontSize={10} fontFamily="'Montserrat',sans-serif"
        fontWeight={600} letterSpacing="0.18em"
        direction="center" staggerMs={32} durationMs={380}
      />
      <span
        ref={iconRef}
        style={{
          position: "relative", width: 14, height: 14, flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          willChange: "transform",
        }}
        aria-hidden
      >
        <span ref={plusHRef} style={{
          position: "absolute", left: "50%", top: "50%",
          width: "100%", height: 1.5, background: "currentColor",
          borderRadius: 2, transform: "translate(-50%,-50%)", willChange: "transform",
        }} />
        <span ref={plusVRef} style={{
          position: "absolute", left: "50%", top: "50%",
          width: "100%", height: 1.5, background: "currentColor",
          borderRadius: 2, transform: "translate(-50%,-50%)", willChange: "transform",
        }} />
      </span>
    </button>
  );
}

function PanelNavItem({ link, active, onClick }: { link: { label: string; href: string }; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <li style={{ position: "relative", overflow: "hidden", lineHeight: 1 }}>
      <Link
        href={link.href}
        className="fnb-navitem"
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ position: "relative", display: "inline-block", textDecoration: "none", paddingRight: "1.4em" }}
      >
        <span
          className="fnb-itemlabel"
          style={{ display: "inline-block", transformOrigin: "50% 100%", willChange: "transform" }}
        >
          <SplitText
            text={link.label}
            fontSize="clamp(2.4rem,4.8vw,3.8rem)"
            fontFamily="'Anton',sans-serif"
            fontWeight={400}
            letterSpacing="-0.02em"
            lineHeight={0.92}
            color={active ? B.red : hov ? B.cream : "rgba(242,237,230,0.55)"}
            hoverColor={B.red}
            direction="left"
            staggerMs={30}
            durationMs={440}
            easing="cubic-bezier(.16,1,.3,1)"
          />
        </span>
        {active && (
          <span style={{
            position: "absolute", left: -16, top: "50%",
            transform: "translateY(-50%)",
            width: 4, height: 4, borderRadius: "50%",
            background: B.red,
          }} />
        )}
      </Link>
    </li>
  );
}

function SocialRollLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a className="fnb-social-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ textDecoration: "none", display: "inline-block", padding: "2px 0" }}
    >
      <SplitText
        text={label}
        color={hov ? B.cream : B.creamDim}
        hoverColor={B.cream}
        fontSize="1.05rem"
        fontFamily="'DM Sans',sans-serif"
        fontWeight={400}
        textTransform="none"
        letterSpacing="normal"
        direction="left"
        staggerMs={22}
        durationMs={340}
      />
    </a>
  );
}

interface SlidePanelProps {
  panelRef:     React.RefObject<HTMLElement | null>;
  preLayersRef: React.RefObject<HTMLDivElement | null>;
  open:         boolean;
  activeLink:   string;
  onLinkClick:  (label: string) => void;
}

function SlidePanel({ panelRef, preLayersRef, open, activeLink, onLinkClick }: SlidePanelProps) {
  return (
    <>
      <div
        ref={preLayersRef}
        aria-hidden
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "clamp(300px,42vw,560px)",
          pointerEvents: "none", zIndex: 1098,
        }}
      >
        <div className="fnb-prelayer" style={{ background: B.layer1 }} />
        <div className="fnb-prelayer" style={{ background: B.layer2 }} />
      </div>

      <aside
        id="fnb-panel"
        ref={panelRef as React.RefObject<HTMLElement>}
        aria-hidden={!open}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "clamp(300px,42vw,560px)",
          background: B.panel,
          display: "flex", flexDirection: "column",
          padding: "7rem 2.5rem 2.5rem",
          overflowY: "auto", zIndex: 1099,
          boxShadow: "-24px 0 80px rgba(0,0,0,0.55)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "140px", mixBlendMode: "overlay", opacity: 0.032,
        }} />

        <div aria-hidden style={{
          position: "absolute", top: "8rem", bottom: "4rem", left: 0, width: 2,
          background: `linear-gradient(to bottom, transparent, ${B.red} 25%, ${B.red} 75%, transparent)`,
          opacity: 0.45, borderRadius: 2, pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p className="fnb-tagline" style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 8.5,
            letterSpacing: "0.44em", textTransform: "uppercase",
            color: B.red, display: "flex", alignItems: "center", gap: 10,
            margin: "0 0 8px",
          }}>
            <span style={{ width: 20, height: 1, background: B.red, flexShrink: 0 }} />
            
          </p>

          <ul className="fnb-navlist" role="list" style={{
            listStyle: "none", margin: 0, padding: 0,
            display: "flex", flexDirection: "column", gap: "0.2rem",
          }}>
            {NAV_LINKS.map((link) => (
              <PanelNavItem
                key={link.label}
                link={link}
                active={activeLink === link.label}
                onClick={() => onLinkClick(link.label)}
              />
            ))}
          </ul>

          <div style={{
            height: 1, marginTop: "auto",
            background: `linear-gradient(90deg,${B.red} 0%,rgba(200,55,45,0.08) 100%)`,
            opacity: 0.35,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 className="fnb-socials-title" style={{
              margin: 0, fontFamily: "'Montserrat',sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.3em",
              textTransform: "uppercase", color: B.red,
            }}>Follow Us</h3>
            <ul style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "flex", flexDirection: "row", alignItems: "center",
              gap: "1.2rem", flexWrap: "wrap",
            }}>
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <SocialRollLink href={s.href} label={s.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

function Backdrop({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed", inset: 0, zIndex: 1097,
        background: "rgba(8,8,8,0.55)",
        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.35s ease",
      }}
      aria-hidden
    />
  );
}

function pathnameToLabel(pathname: string): string {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const match = NAV_LINKS.find((l) => {
    const cleanHref = l.href === "/" ? "/" : l.href.replace(/\/$/, "");
    if (cleanHref === "/") return cleanPath === "/";
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref + "/");
  });
  return match?.label ?? "";
}

export default function FloatingNavbar() {
  const pathname = usePathname();

  const [visible,  setVisible]  = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const [menuOpen,  setMenuOpen]  = useState(false);
  const [menuLabel, setMenuLabel] = useState<"MENU" | "CLOSE">("MENU");

  const [activeLink, setActiveLink] = useState(() => pathnameToLabel(pathname));

  useEffect(() => {
    setActiveLink(pathnameToLabel(pathname));
  }, [pathname]);

  const menuOpenRef = useRef(false);
  const busyRef     = useRef(false);

  const panelRef       = useRef<HTMLElement>(null);
  const preLayersRef   = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef       = useRef<HTMLSpanElement>(null);
  const plusVRef       = useRef<HTMLSpanElement>(null);
  const iconRef        = useRef<HTMLSpanElement>(null);

  const openTlRef     = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTlRef     = useRef<gsap.core.Timeline | null>(null);

  // Always use the section theme — even at top
  const sectionTheme = useSectionTheme(true);
  const pillStyle    = THEME_MAP[sectionTheme];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(!(y > lastScrollY.current && y > 80));
      setScrolled(y > 60);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) closeMenu(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []); // eslint-disable-line

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel   = panelRef.current;
      const preCont = preLayersRef.current;
      if (!panel || !plusHRef.current || !plusVRef.current || !iconRef.current) return;
      const layers = preCont
        ? (Array.from(preCont.querySelectorAll(".fnb-prelayer")) as HTMLElement[])
        : [];
      preLayerElsRef.current = layers;
      gsap.set([panel, ...layers], { xPercent: 100 });
      gsap.set(plusHRef.current, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusVRef.current, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(iconRef.current,  { rotate: 0, transformOrigin: "50% 50%" });
    });
    return () => ctx.revert();
  }, []);

  const buildOpenTl = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;
    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls     = Array.from(panel.querySelectorAll(".fnb-itemlabel"))   as HTMLElement[];
    const socialTitle = panel.querySelector(".fnb-socials-title")              as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll(".fnb-social-link")) as HTMLElement[];
    const tagline     = panel.querySelector(".fnb-tagline")                    as HTMLElement | null;

    const layerStates = layers.map((el) => ({ el, start: Number(gsap.getProperty(el, "xPercent")) }));
    const panelStart  = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length)     gsap.set(itemEls,     { yPercent: 140, rotate: 8 });
    if (socialTitle)        gsap.set(socialTitle, { opacity: 0, y: 10 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });
    if (tagline)            gsap.set(tagline,     { opacity: 0, y: 10 });

    const tl = gsap.timeline({ paused: true });
    layerStates.forEach(({ el, start }, i) => {
      tl.fromTo(el, { xPercent: start }, { xPercent: 0, duration: 0.46, ease: "power4.out" }, i * 0.065);
    });

    const lastLayerAt = (layerStates.length - 1) * 0.065;
    const panelAt     = lastLayerAt + 0.07;
    const panelDur    = 0.6;

    tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDur, ease: "power4.out" }, panelAt);

    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1.0, ease: "power4.out",
        stagger: { each: 0.09, from: "start" },
      }, panelAt + panelDur * 0.14);
    }

    const socialsAt = panelAt + panelDur * 0.36;
    if (tagline)      tl.to(tagline,     { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, socialsAt);
    if (socialTitle)  tl.to(socialTitle, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, socialsAt + 0.06);
    if (socialLinks.length) tl.to(socialLinks, {
      y: 0, opacity: 1, duration: 0.48, ease: "power3.out",
      stagger: { each: 0.07 },
      onComplete: () => { gsap.set(socialLinks, { clearProps: "opacity" }); }
    });

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTl();
    if (tl) { tl.eventCallback("onComplete", () => { busyRef.current = false; }); tl.play(0); }
    else busyRef.current = false;
  }, [buildOpenTl]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100, duration: 0.3, ease: "power3.in", overwrite: "auto",
      onComplete: () => {
        const els = Array.from(panel.querySelectorAll(".fnb-itemlabel")) as HTMLElement[];
        if (els.length) gsap.set(els, { yPercent: 140, rotate: 8 });
        busyRef.current = false;
      },
    });
  }, []);

  const animateIcon = useCallback((opening: boolean) => {
    const h = plusHRef.current, v = plusVRef.current, icon = iconRef.current;
    if (!h || !v || !icon) return;
    spinTlRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0 });
      spinTlRef.current = gsap.timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45,  duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTlRef.current = gsap.timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0,  duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    const next = !menuOpenRef.current;
    menuOpenRef.current = next;
    setMenuOpen(next);
    setMenuLabel(next ? "CLOSE" : "MENU");
    if (next) playOpen(); else playClose();
    animateIcon(next);
  }, [playOpen, playClose, animateIcon]);

  const closeMenu = useCallback(() => {
    if (!menuOpenRef.current) return;
    menuOpenRef.current = false;
    setMenuOpen(false);
    setMenuLabel("MENU");
    playClose();
    animateIcon(false);
  }, [playClose, animateIcon]);

  const handlePanelLink = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  /* ── Pill style — always active (same look at top AND scrolled) ── */
  const pillBase: React.CSSProperties = {
    display:              "flex",
    alignItems:           "center",
    borderRadius:         9999,
    background:           pillStyle.bg,
    border:               `0.5px solid ${pillStyle.border}`,
    boxShadow:            pillStyle.shadow,
    backdropFilter:       "saturate(180%) blur(20px)",
    WebkitBackdropFilter: "saturate(180%) blur(20px)",
    transition:           "background .55s cubic-bezier(.16,1,.3,1), border .55s cubic-bezier(.16,1,.3,1), box-shadow .55s cubic-bezier(.16,1,.3,1)",
    padding:              "8px 18px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fnb-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(200,55,45,0.55); }
          50%      { opacity:.7; box-shadow:0 0 0 5px rgba(200,55,45,0); }
        }
        .fnb-prelayer {
          position: absolute; top: 0; right: 0;
          width: 100%; height: 100%;
        }

        /* ── SplitText hover animation — FIXED ──
           .fnb-char-real is the single real text node.
           .fnb-char-wrap::after paints the "ghost" character
           purely via CSS generated content (content: attr()),
           which is never a real DOM text node, so it can't be
           scraped/indexed as duplicate text. */
        .fnb-char-real {
          display: block;
          transition: transform var(--fnb-duration) var(--fnb-easing) var(--fnb-delay);
        }
        .fnb-char-wrap::after {
          content: attr(data-ghost);
          display: block;
          position: absolute;
          top: 100%;
          left: 0;
          white-space: pre;
          color: var(--fnb-hover-color);
          transition: transform var(--fnb-duration) var(--fnb-easing) var(--fnb-delay);
        }
        a:hover .fnb-char-real,
        button:hover .fnb-char-real { transform: translateY(-100%); }
        a:hover .fnb-char-wrap::after,
        button:hover .fnb-char-wrap::after { transform: translateY(-100%); }

        .fnb-navlist { counter-reset: fnbitem; }
        .fnb-navitem::after {
          counter-increment: fnbitem;
          content: counter(fnbitem, decimal-leading-zero);
          position: absolute; top: 0.1em; right: 0.35em;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: ${B.red}; letter-spacing: 0;
          pointer-events: none; user-select: none;
          opacity: 0; transition: opacity .3s ease;
        }
        .fnb-navitem:hover::after { opacity: 1; }

        /* ── mobile ── */
        @media (max-width: 768px) {
          #fnb-panel         { width: 100% !important; }
          .fnb-desktop-links { display: none !important; }
        }

        #fnb-panel::-webkit-scrollbar       { width: 3px; }
        #fnb-panel::-webkit-scrollbar-track { background: transparent; }
        #fnb-panel::-webkit-scrollbar-thumb { background: rgba(200,55,45,0.3); border-radius: 2px; }
      `}</style>

      {/* ── Single always-visible pill bar ── */}
      <div style={{
        position:   "fixed",
        top:        0,
        left:       0,
        right:      0,
        zIndex:     1100,
        transform:  visible ? "translateY(0)" : "translateY(-110%)",
        transition: "transform .45s cubic-bezier(.16,1,.3,1)",
        pointerEvents: "none",
      }}>
        <div style={{
          padding:        "14px 28px",
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          pointerEvents:  "auto",
        }}>
          {/* Left pill — Logo */}
          <div style={pillBase}>
            <LogoMark logoSrc={LOGO_SRC} />
          </div>

          {/* Right pill — Menu toggle */}
          <div style={pillBase}>
            <MenuToggle
              open={menuOpen} onClick={toggleMenu}
              plusHRef={plusHRef} plusVRef={plusVRef} iconRef={iconRef}
              label={menuLabel} color={pillStyle.iconColor}
            />
          </div>
        </div>
      </div>

      <Backdrop open={menuOpen} onClick={closeMenu} />

      <SlidePanel
        panelRef={panelRef} preLayersRef={preLayersRef}
        open={menuOpen} activeLink={activeLink}
        onLinkClick={handlePanelLink}
      />
    </>
  );
}