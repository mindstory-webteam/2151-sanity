"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";
import GetQuoteForm from "./GetQuoteForm";

/* Same-origin dark copy of the Bigin hosted form (public/forms/contact-form.html) */
const CONTACT_FORM_SRC = "/forms/contact-form.html";

/* PLACEHOLDER HEIGHTS ONLY — contact-form.html measures itself and posts
   { type: 'bigin-height', height }, which GetQuoteForm uses to size the frame.
   These two numbers only reserve space for the first paint. */
const FORM_HEIGHT = 700;
const FORM_HEIGHT_MOBILE = 900;

/* Written by the home page's attribution capture — reused here so a lead who
   landed on a campaign URL and enquired from /contact still credits it. */
const TRACKING_KEY = "f21_tracking";

const clip = (v: string | null | undefined, max = 255) => (v ?? "").trim().slice(0, max);

/* ─────────────────────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────────────────────── */
const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [trackingReady, setTrackingReady] = useState(false);
  const [prefill, setPrefill] = useState({
    leadPageUrl: "",
    utmSource: "",
    utmCampaign: "",
    utmContent: "",
  });

  /* reveal on scroll */
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
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* viewport → placeholder height */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* attribution: this page's URL, plus utm from the URL or the stored session touch */
  useEffect(() => {
    const href = clip(window.location.href);
    try {
      const params = new URLSearchParams(window.location.search);
      let saved: Record<string, string> | null = null;
      try {
        const raw = window.sessionStorage.getItem(TRACKING_KEY);
        saved = raw ? JSON.parse(raw) : null;
      } catch {
        /* private mode — tracking is best effort */
      }

      setPrefill({
        leadPageUrl: href,
        utmSource: clip(params.get("utm_source") || saved?.utmSource),
        utmCampaign: clip(params.get("utm_campaign") || saved?.utmCampaign),
        utmContent: clip(params.get("utm_content") || saved?.utmContent),
      });
    } catch (err) {
      console.error("Tracking capture failed:", err);
      setPrefill((p) => ({ ...p, leadPageUrl: href }));
    } finally {
      /* the form must load even if attribution failed entirely */
      setTrackingReady(true);
    }
  }, []);

  /* the iframe tells us when a submission actually went through */
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "bigin-submitted") setSent(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const overrides = useMemo(
    () => ({
      leadPageUrl: prefill.leadPageUrl,
      utmSource: prefill.utmSource,
      utmCampaign: prefill.utmCampaign,
      utmContent: prefill.utmContent,
    }),
    [prefill.leadPageUrl, prefill.utmSource, prefill.utmCampaign, prefill.utmContent]
  );

  const formHeight = isMobile ? FORM_HEIGHT_MOBILE : FORM_HEIGHT;

  /* ─────────────────────────────────────────────
     CONTACT INFO — each entry can hold one or more
     clickable values (used here to show two phone
     numbers under "Call Us").
  ───────────────────────────────────────────── */
  const contactInfo = [
    {
      icon: <Mail size={16} />,
      label: "Email Us",
      items: [
        { value: "hello@21fiftyone.com", href: "mailto:hello@21fiftyone.com" },
      ],
    },
    {
      icon: <Phone size={16} />,
      label: "Call Us",
      items: [
        { value: "+91 8281610051", href: "tel:+918281610051" },
        { value: "+91 9778189712", href: "tel:+919778189712" },
      ],
    },
    {
      icon: <MapPin size={16} />,
      label: "Find Us",
      items: [
        {
          value:
            "Regus Door No. 2703, Cabin 721, HiLITE Business Park, 7th Floor, Tower 2, Pantheeramkavu, Kozhikode, Kerala 673014",
          href: "#",
        },
      ],
    },
  ];

  return (
    <section className="ct" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        .ct {
          width: 100%;
          background: var(--cream);
          position: relative;
          overflow: hidden;
          padding-bottom: 120px;
        }
        .ct::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── HEADER ── */
        .ct-hdr {
          max-width: 1280px; margin: 0 auto; padding: 100px 80px 56px;
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 40px; border-bottom: 1px solid var(--line); position: relative; z-index: 1;
        }
        .ct-hdr-left { flex: 1; min-width: 0; overflow: visible; }
        .ct-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase; color: var(--red);
          display: block; margin-bottom: 16px;
        }
        .ct-h1 {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(48px, 7vw, 104px) !important;
          line-height: 0.88 !important; letter-spacing: -0.01em !important;
          color: var(--black) !important; text-transform: uppercase;
          display: block !important; overflow: visible !important;
          padding: 10px 6px 6px !important; margin-left: -6px !important;
        }
        .ct-h1 > div { overflow: visible !important; }
        .ct-h1-accent {
          font-family: 'Playfair Display', serif !important; font-style: italic !important;
          font-size: clamp(40px, 5.8vw, 88px) !important; color: var(--red) !important;
          line-height: 0.95 !important; letter-spacing: -0.01em !important;
          display: block !important; overflow: visible !important;
          padding: 0 6px 6px !important; margin-left: -6px !important; margin-top: -0.04em;
        }
        .ct-h1-accent > div { overflow: visible !important; }
        .ct-hdr-desc {
          font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.82;
          color: #5a5450; font-weight: 300; max-width: 460px; margin-top: 24px;
        }
        .ct-hdr-right {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 20px; padding-bottom: 8px; flex-shrink: 0;
        }

        /* ── BODY ── */
        .ct-body {
          max-width: 1280px; margin: 0 auto; padding: 64px 80px 0;
          display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px;
          position: relative; z-index: 1;
        }

        /* ── LEFT PANEL ── */
        .ct-left { display: flex; flex-direction: column; gap: 32px; }
        .ct-info-cards { display: flex; flex-direction: column; gap: 3px; }
        .ct-info-card {
          display: flex; align-items: flex-start; gap: 18px; padding: 20px 24px;
          background: #ece7df; border-left: 3px solid var(--red);
          text-decoration: none; transition: background 0.2s, box-shadow 0.2s;
        }
        .ct-info-card:hover { background: var(--black); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .ct-info-card:hover .ct-info-icon { color: var(--red); }
        .ct-info-card:hover .ct-info-label { color: rgba(255,255,255,0.4); }
        .ct-info-card:hover .ct-info-val { color: #fff; }
        .ct-info-card:hover .ct-info-arrow { opacity: 1; color: var(--red); }
        .ct-info-icon { color: var(--muted); flex-shrink: 0; transition: color 0.2s; margin-top: 2px; }
        .ct-info-text { flex: 1; }
        .ct-info-label {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--muted); display: block;
          margin-bottom: 4px; transition: color 0.2s;
        }
        .ct-info-val {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; color: var(--black); transition: color 0.2s;
        }
        .ct-info-val-link {
          display: block; text-decoration: none; cursor: pointer;
        }
        .ct-info-val-link:hover { color: var(--red); }
        .ct-info-card:hover .ct-info-val-link:hover { color: var(--red); }
        .ct-info-val-link + .ct-info-val-link { margin-top: 4px; }
        .ct-info-arrow { opacity: 0; transition: opacity 0.2s, color 0.2s; color: var(--muted); flex-shrink: 0; margin-top: 2px; }

        .ct-avail {
          display: flex; align-items: center; gap: 12px; padding: 16px 24px;
         
        }
        .ct-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #2ecc71;
          flex-shrink: 0; box-shadow: 0 0 0 3px rgba(46,204,113,0.2);
          animation: ct-pulse 2s infinite;
        }
        @keyframes ct-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(46,204,113,0.2); }
          50%      { box-shadow: 0 0 0 6px rgba(46,204,113,0.08); }
        }
        .ct-avail-text {
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--black);
        }
        .ct-avail-text span { color: var(--muted); }

        .ct-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line);
        }
        .ct-stat { padding: 20px 16px; border-right: 1px solid var(--line); text-align: center; }
        .ct-stat:last-child { border-right: none; }
        .ct-stat-num {
          font-family: 'Anton', sans-serif; font-size: 28px;
          color: var(--red); line-height: 1; display: block;
        }
        .ct-stat-lbl {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted); margin-top: 6px; display: block;
        }

        /* ── RIGHT PANEL — FORM ── */
        .ct-form-wrap {
          background: var(--black); padding: 48px; position: relative; overflow: hidden;
        }
        .ct-form-wrap::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 100%; height: 3px; background: var(--red);
        }
        .ct-form-head { margin-bottom: 36px; }
        .ct-form-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.32em;
          text-transform: uppercase; color: var(--red); display: block; margin-bottom: 10px;
        }
        .ct-form-title {
          font-family: 'Anton', sans-serif; font-size: 28px; letter-spacing: 0.04em;
          text-transform: uppercase; color: #fff; line-height: 1;
        }

        /* ── BIGIN IFRAME ──
           contact-form.html measures itself and GetQuoteForm sets the frame
           height to match, so this wrapper must NOT impose a floor of its own.
           font-size/line-height:0 kills the inline-box descender gap. */
        .ct-bigin { width: 100%; min-height: 0; font-size: 0; line-height: 0; }
        .ct-bigin iframe {
          width: 100% !important;
          border: 0 !important;
          display: block;
          vertical-align: bottom;
        }
        .ct-form-note {
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.14em; color: rgba(255,255,255,0.2); line-height: 1.6;
          margin-top: 18px;
        }

        .ct-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 16px; padding: 48px 24px; text-align: center;
        }
        .ct-success-icon {
          width: 56px; height: 56px; border: 2px solid var(--red);
          display: flex; align-items: center; justify-content: center;
          color: var(--red); font-size: 24px;
        }
        .ct-success-h {
          font-family: 'Anton', sans-serif; font-size: 24px;
          letter-spacing: 0.06em; text-transform: uppercase; color: #fff;
        }
        .ct-success-p {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: rgba(255,255,255,0.4); letter-spacing: 0.08em; line-height: 1.7;
        }

        /* ── BOTTOM STRIP ── */
        .ct-strip {
          max-width: 1280px; margin: 48px auto 0; padding: 0 80px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; border-top: 1px solid var(--line); padding-top: 32px;
          position: relative; z-index: 1;
        }
        .ct-strip-text {
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
        }
        .ct-strip-links { display: flex; align-items: center; gap: 24px; }
        .ct-strip-link {
          font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--muted); text-decoration: none;
          display: flex; align-items: center; gap: 6px; transition: color 0.2s;
        }
        .ct-strip-link:hover { color: var(--red); }

        /* ── REVEAL ── */
        [data-reveal] {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.28s; }
        [data-reveal][data-d="4"] { transition-delay: 0.38s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ct-hdr, .ct-body, .ct-strip { padding-left: 48px; padding-right: 48px; }
        }
        @media (max-width: 900px) {
          .ct-body { grid-template-columns: 1fr; gap: 32px; }
          .ct-left { flex-direction: row; flex-wrap: wrap; }
          .ct-info-cards { flex: 1; min-width: 240px; }
          .ct-stats { flex: 1; min-width: 240px; }
          .ct-avail { width: 100%; }
        }
        @media (max-width: 768px) {
          .ct-hdr { flex-direction: column; align-items: flex-start; padding: 60px 28px 40px; }
          .ct-hdr-right { align-items: flex-start; }
          .ct-body { padding: 32px 28px 0; }
          .ct-strip { padding: 24px 28px 0; flex-direction: column; align-items: flex-start; }
          .ct-form-wrap { padding: 32px 24px; }
          .ct-left { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .ct-hdr { padding: 48px 20px 32px; }
          .ct-body { padding: 24px 16px 0; }
          .ct-strip { padding: 20px 16px 0; }
        }
      `}</style>

      {/* ══ HEADER ══ */}
      <div className="ct-hdr">
        <div className="ct-hdr-left">
          <span className="ct-eyebrow" data-reveal>Get In Touch</span>
          <SplitText
            text="Let's Make"
            tag="div" className="ct-h1"
            delay={38} duration={1.2} ease="power3.out" splitType="chars"
            from={{ opacity: 0, y: 70 }} to={{ opacity: 1, y: 0 }}
            threshold={0.05} rootMargin="-20px"
            textAlign="left" hoverRoll hoverRollDirection="center"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />
          <SplitText
            text="Something."
            tag="div" className="ct-h1-accent"
            delay={30} duration={1.4} ease="power4.out" splitType="chars"
            from={{ opacity: 0, y: 80, skewX: 6 }} to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.05} rootMargin="-20px"
            textAlign="left" hoverRoll hoverRollDirection="left"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />
          <p className="ct-hdr-desc" data-reveal data-d="1">
            Ready to elevate your brand with powerful visual storytelling?
            Share your vision with us—our team will connect with you to craft something impactful.
          </p>
        </div>
        <div className="ct-hdr-right" data-reveal data-d="2">
          <RollButton label="View Our Work" href="/studio" />
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="ct-body">

        {/* ── LEFT ── */}
        <div className="ct-left">
          <div className="ct-info-cards" data-reveal data-d="1">
            {contactInfo.map((info) => (
              <div key={info.label} className="ct-info-card">
                <span className="ct-info-icon">{info.icon}</span>
                <span className="ct-info-text">
                  <span className="ct-info-label">{info.label}</span>
                  {info.items.map((item, idx) => (
                    
                    <a  key={idx}
                      href={item.href}
                      className="ct-info-val ct-info-val-link"
                    >
                      {item.value}
                    </a>
                  ))}
                </span>
                <span className="ct-info-arrow"><ArrowUpRight size={14} /></span>
              </div>
            ))}
          </div>

          <div className="ct-avail" data-reveal data-d="2">
            {/* <span className="ct-avail-dot" />
            <span className="ct-avail-text">
              Currently accepting new projects &nbsp;<span>— 2025</span>
            </span> */}
          </div>

          <div className="ct-stats" data-reveal data-d="3">
            <div className="ct-stat">
              <span className="ct-stat-num">10+</span>
              <span className="ct-stat-lbl">Years Active</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">50+</span>
              <span className="ct-stat-lbl">Team Members</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">500+</span>
              <span className="ct-stat-lbl">Projects Done</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT — BIGIN FORM ── */}
        <div className="ct-form-wrap" data-reveal data-d="2">
          <div className="ct-form-head">
            <span className="ct-form-eyebrow">Start a Project</span>
            <h2 className="ct-form-title">Tell Us About Your Vision</h2>
          </div>

          {sent ? (
            <div className="ct-success">
              <div className="ct-success-icon">✓</div>
              <p className="ct-success-h">Message Received</p>
              <p className="ct-success-p">
                Thank you for reaching out.<br />
                Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="ct-bigin">
                {trackingReady ? (
                  <GetQuoteForm
                    src={CONTACT_FORM_SRC}
                    minHeight={formHeight}
                    overrides={overrides}
                  />
                ) : (
                  /* reserves the same space so the panel does not jump on load */
                  <div style={{ height: formHeight }} aria-hidden="true" />
                )}
              </div>
              <p className="ct-form-note">
                We respond within 24 hours. No spam, ever.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ══ BOTTOM STRIP ══ */}
      {/* <div className="ct-strip" data-reveal>
        <span className="ct-strip-text">© 2025 21FiftyOne. All rights reserved.</span>
        <div className="ct-strip-links">
          <a className="ct-strip-link" href="/privacy">Privacy Policy <ArrowUpRight size={10} /></a>
          <a className="ct-strip-link" href="/terms">Terms <ArrowUpRight size={10} /></a>
          <a className="ct-strip-link" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={10} /></a>
        </div>
      </div> */}

    </section>
  );
};

export default Contact;